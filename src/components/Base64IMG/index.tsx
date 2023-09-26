import { CircularProgress } from "@mui/material";
import { memo, useEffect, useState } from "react";

export const Base64IMG = memo(({file}:any) => {
  const [src, setSrc] = useState<string | undefined>('')

  useEffect(() => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(
          setSrc(reader.result?.toString())
        );
      }
      reader.onerror = error => reject(error);
    });
  }, [file])

  return src ? <img src={src} alt="attachment" /> : <CircularProgress size={30} />;
})