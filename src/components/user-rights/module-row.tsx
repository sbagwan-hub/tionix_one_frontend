import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';

export interface ModuleRowData {
  id: string | number;
  title: string;
  add: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
  print: boolean;
  export: boolean;
}

interface ModuleRowProps {
  row: ModuleRowData;
}

export default function ModuleRow({ row }: ModuleRowProps) {
  return (
    <tr className="hover:bg-muted/30 dark:hover:bg-muted/20 transition">
      <td className="text-foreground p-4 text-sm font-medium">{row.title}</td>

      {(['add', 'edit', 'delete', 'view', 'print', 'export'] as const).map((action) => (
        <td key={action} className="">
          <div className="flex items-center justify-center">
            <Checkbox
              defaultChecked={row[action]}
              className="border-input text-primary focus:ring-primary/50 dark:bg-input/80 h-4 w-4 cursor-pointer rounded transition"
            />
          </div>
        </td>
      ))}
    </tr>
  );
}
