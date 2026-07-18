import { Router } from "express";
import orderController from "./order.controler.js";

const router = Router();

router.get("/:orderNumber", orderController.getPublicOrderByNumber);
router.post("/:orderNumber/pay", orderController.completeOrderPayment);

export default router;
