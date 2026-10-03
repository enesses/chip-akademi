import { isValidElement } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

/**
 * Uygulama içi gezinme bağlantısı — gerçek <a href> KULLANMAZ.
 * Sebep: uygulama tek dosyalık HTML olarak gömülü bir görüntüleyicide
 * çalıştığında, anchor'a her tıklamada "bu bağlantıyı aç" uyarısı çıkıyordu.
 */
export function Link({ href, asChild = false, className, children, onClick, ...rest }) {
  const [, navigate] = useLocation();
  const child = asChild && isValidElement(children) ? children : null;
  const childProps = child?.props ?? {};

  function handleActivate(event) {
    onClick?.(event);
    childProps.onClick?.(event);
    if (event.defaultPrevented) return;
    if (href) navigate(href);
  }
  function handleKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleActivate(event);
  }

  // asChild kullanıldığında çocuktaki TÜM öznitelikler (data-testid, title,
  // aria-* vb.) dış <span>'e aktarılmalı — yoksa üzerine yazılan çocuk
  // etiketi (<a>) hiç DOM'a basılmadığı için o öznitelikler sessizce kaybolur.
  const { className: _c, children: _ch, onClick: _o, ...devralinanOznitelikler } = childProps;

  return (
    <span
      role="link"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className={cn("cursor-pointer", className, childProps.className)}
      {...devralinanOznitelikler}
      {...rest}
    >
      {child ? childProps.children : children}
    </span>
  );
}
export default Link;
