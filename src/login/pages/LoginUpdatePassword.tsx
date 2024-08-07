import { useState } from "react";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    /* Custom Password Box */
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={msg("updatePasswordTitle")}
        >
            <form id="kc-passwd-update-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
                    <FormControl fullWidth sx={{ marginBottom: '15px' }}>
                        <InputLabel htmlFor="password">{msgStr("passwordNew")}</InputLabel>
                        <OutlinedInput
                            fullWidth
                            tabIndex={3}
                            id="password-new"
                            name="password-new"
                            label={msgStr("passwordNew")}
                            type={showPassword ? 'text' : 'password'}
                            error={messagesPerField.existsError("password", "password-confirm")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />

                        <FormHelperText error={messagesPerField.get("password") != ""}>
                            {messagesPerField.get("password")}
                        </FormHelperText>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: '15px' }}>
                        <InputLabel htmlFor="password">{msgStr("passwordConfirm")}</InputLabel>
                        <OutlinedInput
                            fullWidth
                            tabIndex={3}
                            id="password-confirm"
                            name="password-confirm"
                            label={msgStr("passwordConfirm")}
                            type={showPassword ? 'text' : 'password'}
                            error={messagesPerField.existsError("password", "password-confirm")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />

                        <FormHelperText error={messagesPerField.get("password-confirm") != ""}>
                            {messagesPerField.get("password-confirm")}
                        </FormHelperText>
                    </FormControl>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                        <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                value={msgStr("doSubmit")}
                            >{msgStr("doSubmit")}</Button>

                            {isAppInitiatedAction && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    name="cancel-aia"
                                    value="true"
                                >{msg("doCancel")}</Button>
                            )}
                        </div>
                    </div>
                </Box>
            </form>
        </Template>
    );
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
    const { kcClsx, i18n } = props;

    const { msg } = i18n;

    return (
        <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
            <div className={kcClsx("kcFormOptionsWrapperClass")}>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />
                        {msg("logoutOtherSessions")}
                    </label>
                </div>
            </div>
        </div>
    );
}
