// type JobDescriptionProps = {
//   content: string | null;
// };

// export function RichJobDescription({ content }: JobDescriptionProps) {
//   if (!content) {
//     return (
//       <p className="text-muted-foreground italic text-sm">
//         Nenhuma descrição detalhada foi fornecida.
//       </p>
//     );
//   }

//   // Separa o texto por quebras de linha
//   const lines = content.split("\n");

//   return (
//     <div className="text-sm text-foreground/80 space-y-4">

//       {lines.map((line, index) => {
//         const trimmed = line.trim();

//         // 1. É um item de lista? (Começa com •, -, *, ou 1., 2., etc)
//         const isListItem = /^[•\-*]|\d+\./.test(trimmed);
//         if (isListItem) {
//           // Remove o marcador do início para não duplicar
//           const cleanText = trimmed.replace(/^[•\-*]\s*|\d+\.\s*/, "");
//           return (
//             <ul key={index} className="list-none flex gap-2 items-start ml-1 mb-1.5">
//               <span className="mt-1.5 size-1.5 rounded-full bg-primary/60 shrink-0" />
//               <li className="flex-1">{cleanText}</li>
//             </ul>
//           );
//         }

//         // 2. É um título? (Termina com ":", ou tem menos de 60 chars e está em maiúscula/sem pontuação final)
//         const isTitle =
//           trimmed.endsWith(":") ||
//           (trimmed.length < 60 && /^[A-Z]/.test(trimmed) && !/[.!?]$/.test(trimmed));

//         if (isTitle) {
//           return (
//             <h3
//               key={index}
//               className="text-base font-medium text-secondary mt-6 mb-3 first:mt-0"
//             >
//               {trimmed}
//             </h3>
//           );
//         } else {
//           const subTitle = trimmed.endsWith("?") || trimmed.startsWith("Step");
//           if (subTitle) {
//             return (
//               <h4
//                 key={index}
//                 className="text-sm font-medium text-secondary mt-6 mb-3 first:mt-0"
//               >
//                 {trimmed}
//               </h4>
//             );
//           }
//         }

//         // 3. É um parágrafo normal?
//         return (
//           <p key={index} className="whitespace-pre-wrap leading-relaxed mb-2">
//             {trimmed}
//           </p>
//         );
//       })}
//     </div>
//   );
// }

// const LIST_ITEM = /^([•\-*]|\d+[.)])\s+/;

// type Block =
//   | { type: "title"; text: string }
//   | { type: "list"; items: string[] }
//   | { type: "paragraph"; text: string };

// function parseDescription(content: string): Block[] {
//   const blocks: Block[] = [];

//   for (const raw of content.split("\n")) {
//     const line = raw.trim();
//     if (!line) continue;

//     if (LIST_ITEM.test(line)) {
//       const text = line.replace(LIST_ITEM, "");
//       const last = blocks.at(-1);
//       if (last?.type === "list") {
//         last.items.push(text);
//       } else {
//         blocks.push({ type: "list", items: [text] });
//       }
//     } else if (/^[A-Z]/.test(line) && !/[.!?]$/.test(line) && line.endsWith(":") || line.length < 80) {
//       blocks.push({ type: "title", text: line.replace(/:$/, "") });
//     } else {
//       blocks.push({ type: "paragraph", text: line });
//     }
//   }
//   return blocks;
// }

// export function RichJobDescription({ content }: { content: string | null }) {
//   if (!content?.trim()) {
//     return (
//       <p className="text-sm italic text-muted-foreground">
//         Nenhuma descrição detalhada foi fornecida.
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
//       {parseDescription(content).map((b, i) => {
//         if (b.type === "title") {
//           return (
//             <h4
//               key={i}
//               className="mt-5 font-semibold text-secondary first:mt-0"
//             >
//               {b.text}
//             </h4>
//           );
//         }
//         if (b.type === "list") {
//           return (
//             <ul key={i} className="ml-1 space-y-1.5">
//               {b.items.map((text, j) => (
//                 <li key={j} className="flex gap-2">
//                   <span
//                     className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60"
//                     aria-hidden="true"
//                   />
//                   <span>{text}</span>
//                 </li>
//               ))}
//             </ul>
//           );
//         }
//         return <p key={i}>{b.text}</p>;
//       })}
//     </div>
//   );
// }



type JobDescriptionProps = {
  content: string | null;
};

type Block =
  | { type: "title"; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "paragraph"; text: string };

const LIST_ITEM = /^([•\-*]|\d+[.)])\s+/;

function parseDescription(content: string): Block[] {
  const blocks: Block[] = [];

  for (const raw of content.split(/\r\n|\n|\r/)) {
    const line = raw.trim();

    if (!line) continue;

    const listMatch = line.match(LIST_ITEM);

    if (listMatch) {
      const ordered = /^\d/.test(listMatch[0]);
      const text = line.replace(LIST_ITEM, "").trim();
      const last = blocks.at(-1);

      if (last?.type === "list" && last.ordered === ordered) {
        last.items.push(text);
      } else {
        blocks.push({
          type: "list",
          items: [text],
          ordered,
        });
      }

      continue;
    }

    const isTitle =
      line.endsWith(":") ||
      (line.length < 80 &&
      /^[A-ZÀ-Ú]/.test(line) &&
      !/[.!?]$/.test(line));

    if (isTitle) {
      blocks.push({
        type: "title",
        text: line.slice(0, -1),
      });
    } else {
      blocks.push({
        type: "paragraph",
        text: line,
      });
    }
  }

  return blocks;
}

export function RichJobDescription({
  content,
}: JobDescriptionProps) {
  if (!content?.trim()) {
    return (
      <p className="text-sm italic text-muted-foreground">
        Nenhuma descrição detalhada foi fornecida.
      </p>
    );
  }

  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
      {parseDescription(content).map((block, index) => {
        if (block.type === "title") {
          return (
            <h4
              key={index}
              className="pt-2 font-semibold text-secondary first:pt-0"
            >
              {block.text}
            </h4>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";

          return (
            <ListTag
              key={index}
              className={
                block.ordered
                  ? "ml-5 list-decimal space-y-1.5"
                  : "ml-1 space-y-1.5"
              }
            >
              {block.items.map((text, itemIndex) => (
                <li
                  key={itemIndex}
                  className="wrap-break-word pl-1"
                >
                  {block.ordered ? (
                    text
                  ) : (
                    <span className="flex items-start gap-2">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60"
                        aria-hidden="true"
                      />
                      <span>{text}</span>
                    </span>
                  )}
                </li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={index} className="wrap-break-word">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
