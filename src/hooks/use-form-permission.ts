import { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export interface FormPermissions {
  add: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
  print: boolean;
  export: boolean;
  authorize: boolean;
  isLoading: boolean;
}

/**
 * Reusable hook to check permissions for a specific form name.
 *
 * @param formName Name of the form (e.g. 'skintone', 'caste')
 * @returns An object containing boolean permission flags
 */
export function useFormPermission(formName: string): FormPermissions {
  const userRights = useAuthStore((state) => state.userRights);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  return useMemo(() => {
    const defaultPermissions = {
      add: false,
      edit: false,
      delete: false,
      view: false,
      print: false,
      export: false,
      authorize: false,
      isLoading,
    };

    // If user is a system-defined admin, bypass all permissions
    if (user?.role === 'admin' || userRights?.user?.sys_defined) {
      return {
        add: true,
        edit: true,
        delete: true,
        view: true,
        print: true,
        export: true,
        authorize: true,
        isLoading: false,
      };
    }

    if (!userRights) {
      return defaultPermissions;
    }

    const nameLower = formName.toLowerCase();

    // 1. Search in masters
    const masterRow = userRights.masters?.find((r) => r.form_name?.toLowerCase() === nameLower);
    if (masterRow) {
      return {
        add: !!masterRow.add,
        edit: !!masterRow.edit,
        delete: !!masterRow.delete,
        view: !!masterRow.view,
        print: !!masterRow.print,
        export: !!masterRow.export,
        authorize: !!masterRow.authorize,
        isLoading: false,
      };
    }

    // 2. Search in transactions
    const transactionRow = userRights.transactions?.find(
      (r) => r.form_name?.toLowerCase() === nameLower,
    );
    if (transactionRow) {
      return {
        add: !!transactionRow.add,
        edit: !!transactionRow.edit,
        delete: !!transactionRow.delete,
        view: !!transactionRow.view,
        print: !!transactionRow.print,
        export: !!transactionRow.export,
        authorize: !!transactionRow.authorize,
        isLoading: false,
      };
    }

    // 3. Search in reports
    const reportRow = userRights.reports?.find((r) => r.form_name?.toLowerCase() === nameLower);
    if (reportRow) {
      return {
        add: false,
        edit: false,
        delete: false,
        view: !!reportRow.view,
        print: !!reportRow.print,
        export: !!reportRow.export,
        authorize: false,
        isLoading: false,
      };
    }

    // 4. Search in others
    const otherRow = userRights.others?.find((r) => r.form_name?.toLowerCase() === nameLower);
    if (otherRow) {
      const hasRight = !!otherRow.rights;
      return {
        add: hasRight,
        edit: hasRight,
        delete: hasRight,
        view: hasRight,
        print: hasRight,
        export: hasRight,
        authorize: hasRight,
        isLoading: false,
      };
    }

    return defaultPermissions;
  }, [userRights, user, formName, isLoading]);
}
