const router = require("express").Router();
const bannerController = require("./banner.controller");
const faqController = require("./faq.controller");
const staticPageController = require("./staticPage.controller");

/* Public CMS APIs */
router.get("/banners", bannerController.getBanners);
router.get("/faqs", faqController.getFaqs);
router.get("/pages/:key", staticPageController.getPageByKey);

module.exports = router;
