import Icon, { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const lightModeSvg = () => (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor"><path d="M8 13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM8 3a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm7 4a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1ZM3 8a1 1 0 0 1-1 1H1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm9.95 3.536.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414Zm-9.9-7.072-.707-.707a1 1 0 0 1 1.414-1.414l.707.707A1 1 0 0 1 3.05 4.464Zm9.9 0a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414l-.707.707Zm-9.9 7.072a1 1 0 0 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707ZM8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"></path></svg>
)

export const LightModeIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={lightModeSvg} {...props} />
);

const userSvg = () => (
    <svg
        height="48px"
        viewBox="0 0 48 48"
        width="48px"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        {/* SVG content here */}
        <g>
            <g>
                <g>
                    <circle cx="19" cy="19" r="3" style={{ fill: '#22C55E' }} />
                    <circle cx="29" cy="19" r="3" style={{ fill: '#22C55E' }} />
                    <path
                        d="M29,27c0,2.8-2.2,5-5,5s-5-2.2-5-5H29z"
                        style={{ fill: '#22C55E' }}
                    />
                </g>
                <path
                    d="M42.9,46c-0.6-5.3-3.3-10-7.5-13.2c2.1-2.4,3.4-5.5,3.6-8.9c2.3-0.4,4-2.5,4-4.9c0-2.4-1.7-4.4-3.9-4.9l4.6-7.5c1-1.7,1.2-3.3,0.5-4.6C43.5,0.7,42,0,40,0H24C16,0,9.5,6.2,9,14.1c-2.3,0.5-4,2.5-4,4.9c0,2.4,1.7,4.5,4,4.9c0.2,3.4,1.5,6.5,3.6,8.9c-4.3,3.2-7,8-7.5,13.2H2v2h3h2h34h2h3v-2H42.9z M7,19c0-1.3,0.8-2.4,2-2.8v5.7C7.8,21.4,7,20.3,7,19z M11,15c0-7.2,5.8-13,13-13h16c1.2,0,2.1,0.4,2.4,1s0.2,1.6-0.4,2.6l-5,8.1V16h1c1.7,0,3,1.3,3,3s-1.3,3-3,3h-1v1c0,7.2-5.8,13-13,13s-13-5.8-13-13V15z M7.1,46c0.6-4.7,3.1-9,6.9-11.8c2.6,2.3,6.1,3.8,9.9,3.8s7.3-1.4,9.9-3.8c3.9,2.8,6.4,7.1,6.9,11.8H7.1z"
                    style={{ fill: '#303033' }}
                />
            </g>
        </g>
    </svg>
)

export const UserIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={userSvg} {...props} />
);