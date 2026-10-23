// Conjunto de features de Framer Motion que carga LazyMotion. `domAnimation`
// cubre todo lo que usa la web (initial/animate/exit, whileInView, AnimatePresence)
// y pesa bastante menos que el `motion` completo. Si algún día hace falta
// `layout`, `drag` o `whileHover` con layout, cambiar a `domMax`.
import { domAnimation } from "framer-motion";

export default domAnimation;
