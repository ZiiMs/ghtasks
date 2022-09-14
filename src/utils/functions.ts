import { Status } from '@prisma/client';

export const formatStatus = (status: Status) => {
  switch (status) {
    case 'OPEN':
      return 'Open';
    case 'CLOSED':
      return 'Closed';
    case 'NOTSTARTED':
      return 'Not Started';
    case 'INPROGRESS':
      return 'In Progress';
    case 'BUG':
      return 'Bug';
    case 'ENHANCEMENT':
      return 'Enhancement';
    case 'INVALID':
      return 'Invalid';
    case 'QUESTION':
      return 'Question';
  }
};

export const getEnumKeys = <T>(Enum: T): Array<keyof typeof Enum> => {
  // @ts-ignore
  return Object.keys(Enum) as Array<keyof typeof Enum>;
};

