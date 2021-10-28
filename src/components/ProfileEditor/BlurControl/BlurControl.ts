export default interface BlurControl {
  settings: any;
  changeSetting: (key: string, value: any) => void;
  variable: string;
  label: string;
}
