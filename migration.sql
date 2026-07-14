-- Ingresos: añadir concepto, mover datos de observaciones a concepto
ALTER TABLE ingresos ADD COLUMN concepto text;
UPDATE ingresos SET concepto = observaciones WHERE observaciones IS NOT NULL;
UPDATE ingresos SET observaciones = NULL;

-- Gastos: añadir concepto, mover datos de observacion a concepto
ALTER TABLE gastos ADD COLUMN concepto text;
UPDATE gastos SET concepto = observacion WHERE observacion IS NOT NULL;
UPDATE gastos SET observacion = NULL;
