import { useState } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Plus, PackageX, Tag, FileText, Users, Coffee, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut
  useState(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  });

  const handleAction = (action: string) => {
    setOpen(false);
    
    switch (action) {
      case 'add-item':
        navigate('/menu');
        break;
      case 'mark-out-of-stock':
        navigate('/inventory');
        break;
      case 'create-promo':
        // Handle promo creation
        break;
      case 'export-report':
        navigate('/reports');
        break;
      case 'new-order':
        navigate('/orders');
        break;
      case 'add-customer':
        navigate('/customers');
        break;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border rounded-lg hover:bg-accent/50 transition-colors"
      >
        <span>Quick actions...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleAction('add-item')}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Menu Item</span>
            </CommandItem>
            <CommandItem onSelect={() => handleAction('mark-out-of-stock')}>
              <PackageX className="mr-2 h-4 w-4" />
              <span>Mark Item Out of Stock</span>
            </CommandItem>
            <CommandItem onSelect={() => handleAction('create-promo')}>
              <Tag className="mr-2 h-4 w-4" />
              <span>Create Promotion</span>
            </CommandItem>
            <CommandItem onSelect={() => handleAction('export-report')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Export Report</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => handleAction('new-order')}>
              <Coffee className="mr-2 h-4 w-4" />
              <span>View Orders</span>
            </CommandItem>
            <CommandItem onSelect={() => handleAction('add-customer')}>
              <Users className="mr-2 h-4 w-4" />
              <span>Manage Customers</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
