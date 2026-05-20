export function lockModal(
	id: string,
	context: any,
	setSpin: (arg0: boolean) => void
) {
	context.updateContextModal({
		modalId: id,
		withCloseButton: false,
		closeOnEscape: false,
		closeOnClickOutside: false,
		closeButtonProps: { disabled: true }
	});
	setSpin(true);
}

export function unlockModal(
	id: string,
	context: any,
	setSpin: (arg0: boolean) => void
) {
	context.updateContextModal({
		modalId: id,
		withCloseButton: true,
		closeOnEscape: true,
		closeOnClickOutside: true,
		closeButtonProps: { disabled: false }
	});
	setSpin(false);
}
