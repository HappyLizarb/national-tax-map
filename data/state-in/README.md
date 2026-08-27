# Indiana FY2024 data

The active summary contains 144 official Annual Financial Report business-unit groups, not 144 invented departments or committees. The report groups state agencies, universities, facilities, funds, and commissions by business unit and account; that source dimension is preserved as `business unit / account` in `state-in.js`.

There are 141 lazy detail files for multi-row business units. Their filenames use human-readable department slugs, while each detail file preserves the official `businessUnit` code. Three single-row business units stay directly in the summary because separate detail files would be redundant. Older ITP extracts are retained under `archive-itp/` and are not imported.
