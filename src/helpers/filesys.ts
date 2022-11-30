import { invoke } from "@tauri-apps/api/tauri";
import { save, open, confirm } from "@tauri-apps/api/dialog";
import { homeDir } from "@tauri-apps/api/path";

import { Editor } from "@tiptap/react";

const writeFile = (filePath: string, content: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("write_file", { filePath, content }).then((message: unknown) => {
      if (message === "OK") {
        resolve(message as string);
      } else {
        reject("ERROR");
      }
    });
  });
};

const readFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("get_file_content", { filePath })
      .then((message: unknown) => {
        resolve(message as string);
      })
      .catch((error) => reject(error));
  });
};

const showDialogForSaveFile = async () => {
  let selected = await save({
    filters: [{ extensions: ["html"], name: ".html" }],
    title: "Documentos",
    defaultPath: await homeDir(),
  });

  if (!selected) return;

  if (!selected.endsWith(".html")) {
    selected = selected.concat(".html");
  }

  return selected;
};

const showDialogForOpenFile = async () => {
  let selected = await open({
    filters: [{ extensions: ["html"], name: ".html" }],
    title: "Documentos",
    defaultPath: await homeDir(),
  });

  if (!selected) return;

  return selected;
};

export const onSaveFile = (editor?: Editor | null) => {
  // console.log(editor?.getHTML());

  if (!editor?.getHTML()) return;

  const content = editor.getHTML();

  showDialogForSaveFile().then((filePath) => {
    if (!filePath) return;

    writeFile(filePath, content);
  });
};

export const onLoadFile = async (editor?: Editor | null): Promise<string> => {
  const filePath = await showDialogForOpenFile();

  if (!filePath || !editor) return "";

  const fileContent = await readFile(filePath as string);

  editor.commands.setContent(fileContent);

  // return (filePath as string).split("/").at(-1) || "";
  return filePath as string;
};

export const closeApplication = async (
  isChanged: boolean
): Promise<boolean> => {
  return await confirm(
    isChanged
      ? "¡Guarda los cambios antes de salir!"
      : "¿Estás seguro de querer salir de la aplicación?",
    {
      title: "Notebook EMF",
      type: "warning",
    }
  );
};
