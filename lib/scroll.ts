export function smoothScrollTo(elementId: string, offset: number = 0) {
  const element = document.getElementById(elementId);
  if (element) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
}

export function smoothScrollToHash(hash: string, offset: number = 0) {
  const elementId = hash.replace("#", "");
  smoothScrollTo(elementId, offset);
}
