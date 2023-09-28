import { IconType } from '@ng-icons/core';

export type ConfirmationOptions = {
  title: string;
  description?: string;
  showCancelButton: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  color: 'blue' | 'red' | 'yellow' | 'green';
  icon: IconType;
};

export const defaultConfirmationOptions: ConfirmationOptions = {
  title: 'Caution',
  showCancelButton: false,
  confirmButtonText: 'OK',
  color: 'yellow',
  icon: 'heroExclamationCircle',
};
