/// <reference types="nativewind/types" />

declare module "expo-blur" {
    import { ViewProps } from "react-native";
    import { ReactNode } from "react";

    export interface BlurViewProps extends ViewProps {
        intensity?: number;
        tint?: "light" | "dark" | "default";
        children?: ReactNode;
    }

    export class BlurView extends React.Component<BlurViewProps> { }
}
