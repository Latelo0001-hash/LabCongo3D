import type { SchoolStatus as Status } from "../../../types/school";
import { schoolStatusLabels } from "../services/catalog";
export default function SchoolStatus({ status }: { status: Status }) {
  return (
    <span className={`school-status school-status--${status}`}>
      {schoolStatusLabels[status]}
    </span>
  );
}
