-- The admin Travel Resources page (app/admin/(dashboard)/travel-resources)
-- rendered textareas for health guidance, packing list, and travel insurance
-- info, but only visa_info existed as a column on `destinations` -- the other
-- three had nothing to save into, on top of the form itself having no submit
-- handler at all. This adds the missing columns; the save action and public
-- consumption are separate application-layer changes.
alter table destinations add column health_guidance text;
alter table destinations add column packing_list text;
alter table destinations add column insurance_info text;
