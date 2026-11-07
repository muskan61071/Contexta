import { ChevronRight } from 'lucide-react';

interface Props {
  page: string;
}

export default function Header({ page }: Props) {
  return (
    <header className="topbar">
      <div className="crumb">
        <span>Workspace</span>
        <ChevronRight size={14} />
        <strong>{page}</strong>
      </div>
    </header>
  );
}
