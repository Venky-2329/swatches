import Icon, { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const LogoSvg = () => (
    <svg height={'45px'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
  <g id="SVGRepo_iconCarrier">
    {" "}
    <path
      d="M8.5 16C8.5 16 9.34213 16.3664 9.9 16.4635C11.546 16.7498 12.454 15.2502 14.1 15.5365C14.6579 15.6336 15.5 16 15.5 16M7.5 12C7.5 12 8.58274 12.3664 9.3 12.4635C11.4163 12.7498 12.5837 11.2502 14.7 11.5365C15.4173 11.6336 16.5 12 16.5 12M8.5 8C8.5 8 9.34213 8.36641 9.9 8.46346C11.546 8.74982 12.454 7.25018 14.1 7.53654C14.6579 7.63359 15.5 8 15.5 8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="#22c55e"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />{" "}
  </g>
</svg>


)
export const LogoIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={LogoSvg} {...props} />
);