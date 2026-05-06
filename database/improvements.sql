-- =============================================================================
-- CBT NÚM. 5 – PORTAL ESCOLAR
-- Mejoras de Base de Datos – Índices, triggers genéricos, optimizaciones
-- Ejecutar DESPUÉS de schema.sql, rls-policies.sql y views-functions.sql
-- =============================================================================

-- =============================================================================
-- 1. ÍNDICES COMPUESTOS para consultas frecuentes
-- =============================================================================

-- Calificaciones por alumno y ciclo escolar
CREATE INDEX IF NOT EXISTS idx_califs_alumno_ciclo
    ON calificaciones(alumno_id)
    WHERE estatus != 'pendiente';

-- Asistencias por fecha y grupo (reportes diarios)
CREATE INDEX IF NOT EXISTS idx_asist_fecha_grupo
    ON asistencias(fecha, grupo_materia_id);

-- Alumnos por carrera y semestre (listas de grupo)
CREATE INDEX IF NOT EXISTS idx_alumnos_carrera_semestre
    ON alumnos(carrera_id, semestre_actual)
    WHERE estatus = 'regular';

-- Grupos activos por ciclo (dashboard admin)
CREATE INDEX IF NOT EXISTS idx_grupos_ciclo_activo
    ON grupos(ciclo_id, semestre)
    WHERE activo = TRUE;

-- Avisos por destinatario y fecha (feed de noticias)
CREATE INDEX IF NOT EXISTS idx_avisos_destinatario_fecha
    ON avisos(destinatario, fecha_publicacion DESC)
    WHERE estado = 'publicado';

-- Solicitudes de admisión por ciclo y estatus (pipeline)
CREATE INDEX IF NOT EXISTS idx_admision_ciclo_estatus
    ON admision_solicitudes(ciclo_ingreso, estatus);

-- =============================================================================
-- 2. TRIGGER DE AUDITORÍA GENÉRICO (reutilizable para cualquier tabla)
-- =============================================================================

CREATE OR REPLACE FUNCTION audit_generico()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    actor_id UUID;
    rec      JSONB;
BEGIN
    -- Extraer el actor desde el registro JSON para no asumir columnas específicas
    rec := CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::JSONB
                ELSE row_to_json(NEW)::JSONB END;

    actor_id := COALESCE(
        (rec->>'capturado_por')::UUID,
        (rec->>'autor_id')::UUID,
        (rec->>'generado_por')::UUID,
        (rec->>'atendido_por')::UUID,
        NULL
    );

    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log(usuario_id, accion, tabla_afectada, registro_id,
                              datos_anteriores, datos_nuevos)
        VALUES (actor_id, 'UPDATE_' || upper(TG_TABLE_NAME), TG_TABLE_NAME,
                (rec->>'id')::TEXT, row_to_json(OLD)::JSONB, rec);
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log(usuario_id, accion, tabla_afectada, registro_id,
                              datos_nuevos)
        VALUES (actor_id, 'INSERT_' || upper(TG_TABLE_NAME), TG_TABLE_NAME,
                (rec->>'id')::TEXT, rec);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log(usuario_id, accion, tabla_afectada, registro_id,
                              datos_anteriores)
        VALUES (actor_id, 'DELETE_' || upper(TG_TABLE_NAME), TG_TABLE_NAME,
                (rec->>'id')::TEXT, rec);
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Aplicar auditoría genérica a tablas sensibles
CREATE TRIGGER trg_audit_avisos
    AFTER INSERT OR UPDATE OR DELETE ON avisos
    FOR EACH ROW EXECUTE FUNCTION audit_generico();

CREATE TRIGGER trg_audit_asistencias
    AFTER INSERT OR UPDATE ON asistencias
    FOR EACH ROW EXECUTE FUNCTION audit_generico();

CREATE TRIGGER trg_audit_admision
    AFTER INSERT OR UPDATE OR DELETE ON admision_solicitudes
    FOR EACH ROW EXECUTE FUNCTION audit_generico();

CREATE TRIGGER trg_audit_contacto
    AFTER INSERT OR UPDATE ON contacto_mensajes
    FOR EACH ROW EXECUTE FUNCTION audit_generico();

-- =============================================================================
-- 3. FUNCIÓN: Limpiar audit_log antiguo (retención de 90 días)
-- =============================================================================

CREATE OR REPLACE FUNCTION limpiar_audit_log(p_dias_retencion INT DEFAULT 90)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    count_deleted INT;
BEGIN
    DELETE FROM audit_log
    WHERE created_at < NOW() - (p_dias_retencion || ' days')::INTERVAL;

    GET DIAGNOSTICS count_deleted = ROW_COUNT;
    RETURN count_deleted;
END;
$$;

-- =============================================================================
-- 4. FUNCIÓN: Actualizar promedio general de alumno automáticamente
-- =============================================================================

CREATE OR REPLACE FUNCTION actualizar_promedio_alumno()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE alumnos
    SET promedio_general = (
        SELECT ROUND(AVG(calificacion_final), 2)
        FROM calificaciones
        WHERE alumno_id = NEW.alumno_id
          AND calificacion_final IS NOT NULL
          AND calificacion_final > 0
    )
    WHERE id = NEW.alumno_id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_actualizar_promedio
    AFTER INSERT OR UPDATE ON calificaciones
    FOR EACH ROW EXECUTE FUNCTION actualizar_promedio_alumno();

-- =============================================================================
-- 5. FUNCIÓN: Actualizar estatus del alumno basado en promedio
-- =============================================================================

CREATE OR REPLACE FUNCTION actualizar_estatus_alumno()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE alumnos
    SET estatus = CASE
        WHEN NEW.promedio_general >= 7.0 THEN 'regular'
        WHEN NEW.promedio_general >= 6.0 THEN 'en_riesgo'
        WHEN NEW.promedio_general > 0 THEN 'critico'
        ELSE estatus
    END
    WHERE id = NEW.id AND promedio_general IS NOT NULL;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_actualizar_estatus
    AFTER UPDATE OF promedio_general ON alumnos
    FOR EACH ROW EXECUTE FUNCTION actualizar_estatus_alumno();

-- =============================================================================
-- 6. VISTA: Alumnos en riesgo (bajo promedio O alta inasistencia)
-- =============================================================================

CREATE OR REPLACE VIEW v_alumnos_en_riesgo AS
SELECT
    a.id AS alumno_id,
    u.nombre || ' ' || u.apellido_paterno AS nombre,
    c.nombre AS carrera,
    a.semestre_actual,
    a.promedio_general,
    a.estatus,
    COALESCE(
        ROUND(
            COUNT(*) FILTER (WHERE asis.estado = 'ausente')::NUMERIC
            / NULLIF(COUNT(*), 0) * 100, 1
        ), 0
    ) AS porcentaje_inasistencia
FROM alumnos a
JOIN usuarios u ON u.id = a.id
JOIN carreras c ON c.id = a.carrera_id
LEFT JOIN asistencias asis ON asis.alumno_id = a.id
WHERE a.estatus IN ('regular', 'en_riesgo')
GROUP BY a.id, u.nombre, u.apellido_paterno, c.nombre, a.semestre_actual,
         a.promedio_general, a.estatus
HAVING a.promedio_general < 7.0
   OR COUNT(*) FILTER (WHERE asis.estado = 'ausente')::NUMERIC
      / NULLIF(COUNT(*), 0) > 0.20;

-- =============================================================================
-- 7. VISTA: Estadísticas de admisión por ciclo
-- =============================================================================

CREATE OR REPLACE VIEW v_admision_estadisticas AS
SELECT
    ciclo_ingreso,
    COUNT(*) AS total_solicitudes,
    COUNT(*) FILTER (WHERE estatus = 'pendiente') AS pendientes,
    COUNT(*) FILTER (WHERE estatus = 'en_proceso') AS en_proceso,
    COUNT(*) FILTER (WHERE estatus = 'aceptado') AS aceptados,
    COUNT(*) FILTER (WHERE estatus = 'rechazado') AS rechazados,
    COUNT(*) FILTER (WHERE estatus = 'lista_espera') AS lista_espera,
    ROUND(
        COUNT(*) FILTER (WHERE estatus = 'aceptado')::NUMERIC
        / NULLIF(COUNT(*), 0) * 100, 1
    ) AS tasa_aceptacion
FROM admision_solicitudes
GROUP BY ciclo_ingreso
ORDER BY ciclo_ingreso DESC;

-- =============================================================================
-- 8. FUNCIÓN: Generar reporte de boleta para un alumno
-- =============================================================================

CREATE OR REPLACE FUNCTION generar_boleta(
    p_alumno_id UUID,
    p_ciclo_id UUID DEFAULT NULL
)
RETURNS TABLE (
    materia TEXT,
    clave TEXT,
    semestre INT,
    parcial_1 NUMERIC,
    parcial_2 NUMERIC,
    parcial_3 NUMERIC,
    final NUMERIC,
    faltas INT,
    estatus TEXT,
    maestro TEXT,
    grupo TEXT,
    ciclo TEXT
) LANGUAGE sql STABLE AS $$
    SELECT
        m.nombre,
        m.clave,
        m.semestre,
        MAX(c.calificacion) FILTER (WHERE c.parcial = 1) AS parcial_1,
        MAX(c.calificacion) FILTER (WHERE c.parcial = 2) AS parcial_2,
        MAX(c.calificacion) FILTER (WHERE c.parcial = 3) AS parcial_3,
        c.calificacion_final AS final,
        SUM(c.faltas) AS faltas,
        c.estatus::TEXT,
        u.nombre || ' ' || u.apellido_paterno AS maestro,
        g.nombre AS grupo,
        ce.periodo AS ciclo
    FROM calificaciones c
    JOIN grupo_materia gm ON gm.id = c.grupo_materia_id
    JOIN materias m ON m.id = gm.materia_id
    JOIN maestros ma ON ma.id = gm.maestro_id
    JOIN usuarios u ON u.id = ma.id
    JOIN grupos g ON g.id = gm.grupo_id
    JOIN ciclos_escolares ce ON ce.id = gm.ciclo_id
    WHERE c.alumno_id = p_alumno_id
      AND (p_ciclo_id IS NULL OR gm.ciclo_id = p_ciclo_id)
    GROUP BY m.nombre, m.clave, m.semestre, c.calificacion_final, c.estatus,
             u.nombre, u.apellido_paterno, g.nombre, ce.periodo
    ORDER BY m.semestre, m.nombre;
$$;
