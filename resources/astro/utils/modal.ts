export function modal({
  trigger,
  modal,
  close: closeSelector,
  onOpen,
  onClose,
}: {
  trigger: string;
  modal: string;
  close?: string;
  onOpen?: () => void;
  onClose?: () => void;
}) {
  const triggerEl = document.querySelector(trigger);
  const modalEl = document.querySelector(modal);
  const closeEl = closeSelector ? document.querySelector(closeSelector) : null;

  if (!(modalEl instanceof HTMLDialogElement)) {
    return { open: () => {}, close: () => {} };
  }

  const open = () => {
    modalEl.showModal();
  };

  const close = () => {
    modalEl.close();
  };

  triggerEl?.addEventListener("click", open);

  closeEl?.addEventListener("click", close);

  modalEl.addEventListener("open", () => {
    onOpen?.();
  });
  modalEl.addEventListener("close", () => {
    onClose?.();
  });

  return { open, close };
}
