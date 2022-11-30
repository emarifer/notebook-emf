import { ReactElement } from "react";

interface IStatusBarProps {
  isChanged: boolean;
  fileName: string;
}

export default function StatusBar({
  isChanged,
  fileName,
}: IStatusBarProps): ReactElement {
  return (
    <div className="statusBar">
      <div>Editando el fichero:</div>
      <div>[ {isChanged ? fileName + "*" : fileName} ]</div>
    </div>
  );
}
