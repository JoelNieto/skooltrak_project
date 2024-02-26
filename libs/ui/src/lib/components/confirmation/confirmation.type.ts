export type ConfirmationOptions = {
  title: string;
  description?: string;
  showCancelButton: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  color: 'accent' | 'primary' | 'warn';
  icon: string;
};

export const defaultConfirmationOptions: ConfirmationOptions = {
  title: 'Caution',
  showCancelButton: false,
  confirmButtonText: 'OK',
  color: 'primary',
  icon: 'delete',
};
