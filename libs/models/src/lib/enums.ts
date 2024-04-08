export enum StatusEnum {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum RoleEnum {
  Administrator = 'ADMIN',
  Teacher = 'TEACHER',
  Parent = 'PARENT',
  Student = 'STUDENT',
}

export enum SchoolTypeEnum {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  MIXED = 'MIXED',
  OTHER = 'OTHER',
}

export enum ChannelTypeEnum {
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',
  PUBLIC = 'PUBLIC',
}

export enum ChannelPermissionEnum {
  READ = 'READ',
  WRITE = 'WRITE',
}

export enum PaymentMethodEnum {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  TRANSFER = 'TRANSFER',
  OTHER = 'OTHER',
}

export enum QuestionTypeEnum {
  SHORT_TEXT = 'SHORT_TEXT',
  LONG_TEXT = 'LONG_TEXT',
  SELECTION = 'SELECTION',
  BOOLEAN = 'BOOLEAN',
  MATCH = 'MATCH',
}

export const WeekDays = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export type FileBucket = 'crests' | 'courses' | 'avatars' | 'files';
