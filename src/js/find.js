import { loadHeaderFooter, setBreadcrumb } from './utils.mjs';

loadHeaderFooter();

//set the breadcrumbs
let breadcrumbList = [`<a href='../index.html'>Home</a>`, `<a href="/asteroid-detail/find.html">Find Asteroid by ID</a>`];
setBreadcrumb(breadcrumbList);



