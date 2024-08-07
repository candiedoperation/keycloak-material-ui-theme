import { useEffect, useState } from "react";
import { assert } from "keycloakify/tools/assert";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useInsertScriptTags } from "keycloakify/tools/useInsertScriptTags";
import { useInsertLinkTags } from "keycloakify/tools/useInsertLinkTags";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Alert, Backdrop, Box, LinearProgress, MenuItem, Paper, Select, Typography } from "@mui/material";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss: false, classes });

    const { msg, msgStr, getChangeLocaleUrl, labelBySupportedLanguageTag, currentLanguageTag } = i18n;

    const { realm, locale, auth, url, message, isAppInitiatedAction, authenticationSession, scripts } = kcContext;

    const UNSPLASH_API_KEY = "INVALID_API_KEY!";
    const [pageLoading, setPageLoading] = useState(true);
    const [bgImageURL, setBgImageURL] = useState(`${import.meta.env.BASE_URL}img/default-background.png`);
    const [bgImageCredit, setBgImageCredit] = useState("Boris Ryabov");

    useEffect(() => {
        const apiURL = `https://api.unsplash.com/photos/random?orientation=landscape&query=skyscrapers%20wallpaper&client_id=${UNSPLASH_API_KEY}`;
        fetch(apiURL)
            .catch((e) => { console.error(e); setPageLoading(false); })
            .then((res) => {
                if (!res || !res.ok) {
                    setPageLoading(false);
                    return console.error(res);
                }

                res.json()
                    .catch((e) => { console.error(e) })
                    .then(async (apiJson) => {
                        /* Fetch the Image so it's cached */
                        const img = new Image();
                        img.onerror = () => setPageLoading(false);
                        img.onload = () => {
                            setPageLoading(false);
                            setBgImageURL(apiJson.links.download);
                            setBgImageCredit(`${apiJson.user.first_name} ${apiJson.user.last_name}`)
                        }

                        /* Download the Image */
                        img.src = apiJson.links.download;
                    });
            });
    }, []);

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: "kc-mui-htmlClass"
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? "kc-mui-BodyClass"
    });

    useEffect(() => {
        const { currentLanguageTag } = locale ?? {};

        if (currentLanguageTag === undefined) {
            return;
        }

        const html = document.querySelector("html");
        assert(html !== null);
        html.lang = currentLanguageTag;
    }, []);

    const { areAllStyleSheetsLoaded } = useInsertLinkTags({
        componentOrHookName: "Template",
        hrefs: !doUseDefaultCss
            ? []
            : [
                `${url.resourcesCommonPath}/node_modules/@patternfly/patternfly/patternfly.min.css`,
                `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
                `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
                `${url.resourcesCommonPath}/lib/pficon/pficon.css`,
                `${url.resourcesPath}/css/login.css`
            ]
    });

    const { insertScriptTags } = useInsertScriptTags({
        componentOrHookName: "Template",
        scriptTags: [
            {
                type: "module",
                src: `${url.resourcesPath}/js/menu-button-links.js`
            },
            ...(authenticationSession === undefined
                ? []
                : [
                    {
                        type: "module",
                        textContent: [
                            `import { checkCookiesAndSetTimer } from "${url.resourcesPath}/js/authChecker.js";`,
                            ``,
                            `checkCookiesAndSetTimer(`,
                            `  "${authenticationSession.authSessionId}",`,
                            `  "${authenticationSession.tabId}",`,
                            `  "${url.ssoLoginInOtherTabsUrl}"`,
                            `);`
                        ].join("\n")
                    } as const
                ]),
            ...scripts.map(
                script =>
                    ({
                        type: "text/javascript",
                        src: script
                    }) as const
            )
        ]
    });

    useEffect(() => {
        if (areAllStyleSheetsLoaded) {
            insertScriptTags();
        }
    }, [areAllStyleSheetsLoaded]);

    if (!areAllStyleSheetsLoaded) {
        return null;
    }

    return (
        <Box
            id="kc-tmplt-mdiv"
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: `url(${bgImageURL});`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}
        >
            <Box id="kc-mui-header" sx={{ marginBottom: '25px' }}>
                {/* <Typography variant="h3">{realm.displayName}</Typography> */}
                {/* <div id="kc-header-wrapper" className={kcClsx("kcHeaderWrapperClass")}>
                {msg("loginTitleHtml", realm.displayNameHtml)}
            </div> */}
            </Box>

            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '25px',
                    borderRadius: '16px',
                    zIndex: 1,
                    width: { xs: '90%', md: '60%', lg: '40%' }
                }}
            >
                {realm.internationalizationEnabled && (assert(locale !== undefined), locale.supported.length > 1) && (
                    <Select
                        value={labelBySupportedLanguageTag[currentLanguageTag]}
                        size="small"
                        sx={{ alignSelf: 'end', marginBottom: '15px' }}
                    >
                        {locale.supported.map(({ languageTag }, i) => (
                            <MenuItem
                                id={`language-${i + 1}`}
                                value={labelBySupportedLanguageTag[languageTag]}
                                onClick={() => window.location.href = getChangeLocaleUrl(languageTag)}
                            >{labelBySupportedLanguageTag[languageTag]}</MenuItem>
                        ))}
                    </Select>)
                }

                { /* Title? */}
                <Typography textAlign="center" variant="h5">{headerNode}</Typography>

                {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                    <Alert sx={{ margin: '10px 0px 10px 0px' }} severity={message.type}>{message.summary}</Alert>
                )}

                {children}
                
                {auth !== undefined && auth.showTryAnotherWayLink && (
                    <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                        <div className={kcClsx("kcFormGroupClass")}>
                            <div className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" name="tryAnotherWay" value="on" />
                                <a
                                    href="#"
                                    id="try-another-way"
                                    onClick={() => {
                                        document.forms["kc-select-try-another-way-form" as never].submit();
                                        return false;
                                    }}
                                >
                                    {msg("doTryAnotherWay")}
                                </a>
                            </div>
                        </div>
                    </form>
                )}
                {socialProvidersNode}
            </Paper>

            <Alert
                severity="info"
                sx={{
                    marginTop: '-15px',
                    paddingTop: '20px',
                    borderRadius: '0px 0px 10px 10px',
                    zIndex: 0,
                    width: { xs: '90%', md: '60%', lg: '40%' },
                    display: 'flex'
                }}
            >
                {(displayInfo) ? infoNode : ""}
                <span>Photo by {bgImageCredit} on Unsplash</span>
            </Alert>

            {/* Loading Backdrop */}
            <Backdrop
                open={pageLoading}
                autoFocus
                sx={{
                    background: 'rgba(0,0,0,0.9)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'white'
                }}
            >
                <LinearProgress color="inherit" variant="indeterminate" sx={{ width: '80%' }} />
                <Typography sx={{ color: 'white', marginTop: '8px' }} variant="h6">⚡ Blazzzing through the Internet...</Typography>
            </Backdrop>
        </Box>
    );
}
