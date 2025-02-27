import React, { forwardRef } from "react";
import { StyledInputStyled } from "./styled";

// Omit은 타입스크립트 문법, size만 빼고 가져옴, size는 만들어뒀기 때문에 빼고 가져옴
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    variant?: "default" | "outline" | "filled";
    size?: "small" | "medium" | "large"; // ✅ 우리가 원하는 `size` 타입
    fullWidth?: boolean;
    error?: boolean;
}

export const StyledInput = forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
    return <StyledInputStyled ref={ref} {...props} />;
});
