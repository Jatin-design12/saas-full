(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/saas-website/src/components/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Navbar({ onRequestDemo }) {
    _s();
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const handleScroll = {
                "Navbar.useEffect.handleScroll": ()=>{
                    setScrolled(window.scrollY > 20);
                }
            }["Navbar.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll);
            return ({
                "Navbar.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        style: {
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.94)' : '#FFFFFF',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
            transition: 'all 0.25s ease'
        },
        className: "jsx-3cbd544596806c61",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '76px'
                },
                className: "jsx-3cbd544596806c61" + " " + "container-custom",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "#",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none'
                        },
                        className: "jsx-3cbd544596806c61",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/assets/evegah_logo_clean.png",
                            alt: "Evegah",
                            style: {
                                height: '36px',
                                width: 'auto',
                                objectFit: 'contain'
                            },
                            className: "jsx-3cbd544596806c61"
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/Navbar.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '32px'
                        },
                        className: "jsx-3cbd544596806c61" + " " + "desktop-nav",
                        children: [
                            {
                                label: 'Product',
                                href: '#features'
                            },
                            {
                                label: 'Solutions',
                                href: '#features'
                            },
                            {
                                label: 'Enterprise',
                                href: '#features'
                            },
                            {
                                label: 'Pricing',
                                href: '#pricing'
                            },
                            {
                                label: 'Resources',
                                href: '#how-it-works'
                            },
                            {
                                label: 'Contact',
                                href: '#contact'
                            }
                        ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: item.href,
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#475569',
                                    textDecoration: 'none',
                                    transition: 'color 0.15s ease'
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.color = '#2A195C',
                                onMouseLeave: (e)=>e.currentTarget.style.color = '#475569',
                                className: "jsx-3cbd544596806c61",
                                children: item.label
                            }, item.label, false, {
                                fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        },
                        className: "jsx-3cbd544596806c61" + " " + "desktop-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "http://localhost:3000/login",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                style: {
                                    padding: '9px 20px',
                                    fontSize: '13.5px',
                                    fontWeight: 700,
                                    color: '#334155',
                                    backgroundColor: '#FFFFFF',
                                    border: '1.5px solid #CBD5E1',
                                    borderRadius: '9999px',
                                    textDecoration: 'none',
                                    transition: 'all 0.15s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.borderColor = '#2A195C';
                                    e.currentTarget.style.color = '#2A195C';
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.borderColor = '#CBD5E1';
                                    e.currentTarget.style.color = '#334155';
                                },
                                className: "jsx-3cbd544596806c61",
                                children: "Login"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onRequestDemo,
                                style: {
                                    padding: '10px 22px',
                                    fontSize: '13.5px'
                                },
                                className: "jsx-3cbd544596806c61" + " " + "btn-primary",
                                children: "Request a Demo"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                        "aria-label": "Toggle Navigation",
                        style: {
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            color: '#1E293B'
                        },
                        className: "jsx-3cbd544596806c61" + " " + "mobile-toggle",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "24",
                            height: "24",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2.2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            className: "jsx-3cbd544596806c61",
                            children: mobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "18",
                                        y1: "6",
                                        x2: "6",
                                        y2: "18",
                                        className: "jsx-3cbd544596806c61"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                        lineNumber: 134,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "6",
                                        y1: "6",
                                        x2: "18",
                                        y2: "18",
                                        className: "jsx-3cbd544596806c61"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                        lineNumber: 135,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "4",
                                        y1: "7",
                                        x2: "20",
                                        y2: "7",
                                        className: "jsx-3cbd544596806c61"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                        lineNumber: 139,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "4",
                                        y1: "12",
                                        x2: "20",
                                        y2: "12",
                                        className: "jsx-3cbd544596806c61"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "4",
                                        y1: "17",
                                        x2: "20",
                                        y2: "17",
                                        className: "jsx-3cbd544596806c61"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/Navbar.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/components/Navbar.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: '#FFFFFF',
                    borderTop: '1px solid #F1F5F9',
                    padding: '16px 24px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.06)'
                },
                className: "jsx-3cbd544596806c61",
                children: [
                    [
                        'Product',
                        'Solutions',
                        'Enterprise',
                        'Pricing',
                        'Resources',
                        'Contact'
                    ].map((label)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `#${label.toLowerCase()}`,
                            onClick: ()=>setMobileMenuOpen(false),
                            style: {
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#334155',
                                textDecoration: 'none',
                                padding: '6px 0'
                            },
                            className: "jsx-3cbd544596806c61",
                            children: label
                        }, label, false, {
                            fileName: "[project]/saas-website/src/components/Navbar.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '10px',
                            marginTop: '10px'
                        },
                        className: "jsx-3cbd544596806c61",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "http://localhost:3000/login",
                                style: {
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '10px',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    color: '#334155',
                                    textDecoration: 'none'
                                },
                                className: "jsx-3cbd544596806c61",
                                children: "Login"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setMobileMenuOpen(false);
                                    onRequestDemo();
                                },
                                style: {
                                    flex: 1.4,
                                    textAlign: 'center',
                                    padding: '10px',
                                    backgroundColor: '#2A195C',
                                    color: '#FFFFFF',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: 'pointer'
                                },
                                className: "jsx-3cbd544596806c61",
                                children: "Request a Demo"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/Navbar.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/Navbar.tsx",
                        lineNumber: 177,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/components/Navbar.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "3cbd544596806c61",
                children: "@media (width<=900px){.desktop-nav,.desktop-actions{display:none!important}.mobile-toggle{display:block!important}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/saas-website/src/components/Navbar.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_s(Navbar, "NqmbluxoEaGq8zA44dCGrohDScQ=");
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/Hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Hero({ onRequestDemo, onWatchVideo }) {
    _s();
    const [lightboxImg, setLightboxImg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        style: {
            paddingTop: '32px',
            paddingBottom: '68px',
            backgroundColor: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden'
        },
        className: "jsx-a22599fa77661422",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: '-10%',
                    right: '5%',
                    width: '560px',
                    height: '560px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(220, 252, 231, 0.55) 0%, rgba(243, 232, 255, 0.45) 45%, rgba(255, 255, 255, 0) 75%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                    zIndex: 1
                },
                className: "jsx-a22599fa77661422" + " " + "animate-pulse-glow"
            }, void 0, false, {
                fileName: "[project]/saas-website/src/components/Hero.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'relative',
                    zIndex: 10
                },
                className: "jsx-a22599fa77661422" + " " + "container-custom",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-a22599fa77661422" + " " + "hero-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a22599fa77661422" + " " + "hero-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '12px'
                                    },
                                    className: "jsx-a22599fa77661422",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                margin: 0
                                            },
                                            className: "jsx-a22599fa77661422" + " " + "section-tag",
                                            children: "EV FLEET MANAGEMENT PLATFORM"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 45,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                color: '#16A34A',
                                                background: '#DCFCE7',
                                                padding: '2px 9px',
                                                borderRadius: '9999px'
                                            },
                                            className: "jsx-a22599fa77661422",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: '#16A34A'
                                                    },
                                                    className: "jsx-a22599fa77661422" + " " + "animate-pulse-dot"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 49,
                                                    columnNumber: 17
                                                }, this),
                                                "Real-Time Telematics"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 48,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    style: {
                                        fontFamily: 'Outfit, sans-serif',
                                        fontSize: '52px',
                                        fontWeight: 900,
                                        color: '#0F172A',
                                        lineHeight: 1.08,
                                        letterSpacing: '-0.025em',
                                        marginBottom: '16px'
                                    },
                                    className: "jsx-a22599fa77661422",
                                    children: [
                                        "India's Smartest EV.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                            className: "jsx-a22599fa77661422"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 66,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#16A34A'
                                            },
                                            className: "jsx-a22599fa77661422",
                                            children: "Rental"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 67,
                                            columnNumber: 15
                                        }, this),
                                        " Mobility."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '15.5px',
                                        color: '#475569',
                                        lineHeight: 1.6,
                                        marginBottom: '28px',
                                        maxWidth: '470px',
                                        fontWeight: 500
                                    },
                                    className: "jsx-a22599fa77661422",
                                    children: "A complete SaaS platform to manage your EV fleet, riders, battery operations, rentals and more — built for a cleaner, smarter and more sustainable future."
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        flexWrap: 'wrap',
                                        marginBottom: '34px'
                                    },
                                    className: "jsx-a22599fa77661422",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: onRequestDemo,
                                            style: {
                                                padding: '13px 26px',
                                                fontSize: '14.5px'
                                            },
                                            className: "jsx-a22599fa77661422" + " " + "btn-primary",
                                            children: [
                                                "Request a Demo",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "16",
                                                    height: "16",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2.5",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    className: "jsx-a22599fa77661422",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "5",
                                                            y1: "12",
                                                            x2: "19",
                                                            y2: "12",
                                                            className: "jsx-a22599fa77661422"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 92,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "12 5 19 12 12 19",
                                                            className: "jsx-a22599fa77661422"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 93,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 85,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: onWatchVideo,
                                            style: {
                                                padding: '12px 22px',
                                                fontSize: '14px'
                                            },
                                            className: "jsx-a22599fa77661422" + " " + "btn-secondary",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#F3E8FF',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#2A195C'
                                                    },
                                                    className: "jsx-a22599fa77661422",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "11",
                                                        height: "11",
                                                        viewBox: "0 0 24 24",
                                                        fill: "currentColor",
                                                        className: "jsx-a22599fa77661422",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                            points: "5 3 19 12 5 21 5 3",
                                                            className: "jsx-a22599fa77661422"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 115,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 17
                                                }, this),
                                                "Watch Video"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 97,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-a22599fa77661422" + " " + "hero-pills-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a22599fa77661422" + " " + "benefit-pill",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        background: '#DCFCE7',
                                                        color: '#16A34A'
                                                    },
                                                    className: "jsx-a22599fa77661422" + " " + "pill-icon-box",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "15",
                                                        height: "15",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-a22599fa77661422",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                points: "23 6 13.5 15.5 8.5 10.5 1 18",
                                                                className: "jsx-a22599fa77661422"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 127,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                points: "17 6 23 6 23 12",
                                                                className: "jsx-a22599fa77661422"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 128,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a22599fa77661422" + " " + "pill-text",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a22599fa77661422" + " " + "pill-title",
                                                            children: "Increase"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 132,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a22599fa77661422" + " " + "pill-sub",
                                                            children: "Efficiency"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 124,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a22599fa77661422" + " " + "benefit-pill",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        background: '#DCFCE7',
                                                        color: '#16A34A'
                                                    },
                                                    className: "jsx-a22599fa77661422" + " " + "pill-icon-box",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '14px',
                                                            fontWeight: 800
                                                        },
                                                        className: "jsx-a22599fa77661422",
                                                        children: "₹"
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a22599fa77661422" + " " + "pill-text",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a22599fa77661422" + " " + "pill-title",
                                                            children: "Reduce"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 142,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a22599fa77661422" + " " + "pill-sub",
                                                            children: "Operational Cost"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a22599fa77661422" + " " + "benefit-pill",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        background: '#DCFCE7',
                                                        color: '#16A34A'
                                                    },
                                                    className: "jsx-a22599fa77661422" + " " + "pill-icon-box",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "15",
                                                        height: "15",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-a22599fa77661422",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
                                                                className: "jsx-a22599fa77661422"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 150,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                cx: "12",
                                                                cy: "12",
                                                                r: "3",
                                                                className: "jsx-a22599fa77661422"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 151,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                        lineNumber: 149,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a22599fa77661422" + " " + "pill-text",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a22599fa77661422" + " " + "pill-title",
                                                            children: "Real-time"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a22599fa77661422" + " " + "pill-sub",
                                                            children: "Visibility"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 147,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a22599fa77661422" + " " + "benefit-pill",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        background: '#DCFCE7',
                                                        color: '#16A34A'
                                                    },
                                                    className: "jsx-a22599fa77661422" + " " + "pill-icon-box",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "15",
                                                        height: "15",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-a22599fa77661422",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M11 20A7 7 0 0 1 4 13C4 8.5 7.5 4 14 3c0 0 0 3-1 6",
                                                                className: "jsx-a22599fa77661422"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M11 20c4.5 0 8.5-3.5 9.5-10 0 0-3 0-6 1",
                                                                className: "jsx-a22599fa77661422"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 164,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M11 20v-7",
                                                                className: "jsx-a22599fa77661422"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 165,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a22599fa77661422" + " " + "pill-text",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a22599fa77661422" + " " + "pill-title",
                                                            children: "Lower Carbon"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 169,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a22599fa77661422" + " " + "pill-sub",
                                                            children: "Footprint"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 170,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                            lineNumber: 160,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a22599fa77661422" + " " + "hero-right",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a22599fa77661422" + " " + "showcase-wrapper",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>setLightboxImg('/assets/real_admin_dashboard.png'),
                                        title: "Click to view full-size admin dashboard",
                                        className: "jsx-a22599fa77661422" + " " + "laptop-container animate-float-laptop",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a22599fa77661422" + " " + "laptop-lid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-a22599fa77661422" + " " + "laptop-camera-bar",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-a22599fa77661422" + " " + "laptop-camera-lens"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                            lineNumber: 188,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-a22599fa77661422" + " " + "laptop-screen",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: "/assets/real_admin_dashboard.png",
                                                                alt: "Evegah Real Admin Fleet Dashboard",
                                                                className: "jsx-a22599fa77661422" + " " + "laptop-screen-img"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 191,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-a22599fa77661422" + " " + "screen-zoom-hint",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        width: "12",
                                                                        height: "12",
                                                                        viewBox: "0 0 24 24",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        strokeWidth: "2.5",
                                                                        className: "jsx-a22599fa77661422",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                cx: "11",
                                                                                cy: "11",
                                                                                r: "8",
                                                                                className: "jsx-a22599fa77661422"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                                lineNumber: 198,
                                                                                columnNumber: 123
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                x1: "21",
                                                                                y1: "21",
                                                                                x2: "16.65",
                                                                                y2: "16.65",
                                                                                className: "jsx-a22599fa77661422"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                                lineNumber: 198,
                                                                                columnNumber: 154
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                x1: "11",
                                                                                y1: "8",
                                                                                x2: "11",
                                                                                y2: "14",
                                                                                className: "jsx-a22599fa77661422"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                                lineNumber: 198,
                                                                                columnNumber: 199
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                x1: "8",
                                                                                y1: "11",
                                                                                x2: "14",
                                                                                y2: "11",
                                                                                className: "jsx-a22599fa77661422"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                                lineNumber: 198,
                                                                                columnNumber: 237
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                        lineNumber: 198,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "Inspect Fleet OS"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 197,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                        lineNumber: 190,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a22599fa77661422" + " " + "laptop-base"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                lineNumber: 204,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>setLightboxImg('/assets/real_mobile_app.jpg'),
                                        title: "Click to view full-size mobile app",
                                        className: "jsx-a22599fa77661422" + " " + "phone-container animate-float-mobile",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a22599fa77661422" + " " + "phone-notch",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a22599fa77661422" + " " + "phone-speaker"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                lineNumber: 214,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a22599fa77661422" + " " + "phone-screen",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: "/assets/real_mobile_app.jpg",
                                                        alt: "Evegah Real Rider Mobile App",
                                                        className: "jsx-a22599fa77661422" + " " + "phone-screen-img"
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-a22599fa77661422" + " " + "phone-zoom-hint",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "11",
                                                                height: "11",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                strokeWidth: "2.5",
                                                                className: "jsx-a22599fa77661422",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                        cx: "11",
                                                                        cy: "11",
                                                                        r: "8",
                                                                        className: "jsx-a22599fa77661422"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                        lineNumber: 225,
                                                                        columnNumber: 121
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                        x1: "21",
                                                                        y1: "21",
                                                                        x2: "16.65",
                                                                        y2: "16.65",
                                                                        className: "jsx-a22599fa77661422"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                        lineNumber: 225,
                                                                        columnNumber: 152
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                                lineNumber: 225,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Rider App"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                lineNumber: 217,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                        lineNumber: 208,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a22599fa77661422" + " " + "hero-callout-script font-script animate-sway",
                                        children: [
                                            "Cleaner Cities",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                className: "jsx-a22599fa77661422"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                lineNumber: 233,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#16A34A'
                                                },
                                                className: "jsx-a22599fa77661422",
                                                children: "Brighter Tomorrow"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                                lineNumber: 234,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Hero.tsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/saas-website/src/components/Hero.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            lightboxImg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                },
                onClick: ()=>setLightboxImg(null),
                className: "jsx-a22599fa77661422",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        maxWidth: '1050px',
                        width: '100%',
                        backgroundColor: '#0F172A',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                        position: 'relative',
                        border: '1px solid #334155'
                    },
                    onClick: (e)=>e.stopPropagation(),
                    className: "jsx-a22599fa77661422",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 20px',
                                background: '#1E293B',
                                borderBottom: '1px solid #334155'
                            },
                            className: "jsx-a22599fa77661422",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        color: '#F8FAFC'
                                    },
                                    className: "jsx-a22599fa77661422",
                                    children: lightboxImg.includes('admin') ? 'Evegah Super Admin Fleet & Subscription Analytics' : 'Evegah Rider Mobile App (Android / iOS)'
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                    lineNumber: 271,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setLightboxImg(null),
                                    style: {
                                        background: 'none',
                                        border: 'none',
                                        color: '#94A3B8',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        padding: '4px'
                                    },
                                    className: "jsx-a22599fa77661422",
                                    children: "✕ Close"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                                    lineNumber: 274,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                            lineNumber: 270,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                padding: '10px'
                            },
                            className: "jsx-a22599fa77661422",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: lightboxImg,
                                alt: "Full Screenshot",
                                style: {
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    display: 'block'
                                },
                                className: "jsx-a22599fa77661422"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/Hero.tsx",
                                lineNumber: 282,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/Hero.tsx",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/Hero.tsx",
                    lineNumber: 257,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/saas-website/src/components/Hero.tsx",
                lineNumber: 243,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "a22599fa77661422",
                children: '.hero-grid.jsx-a22599fa77661422{grid-template-columns:1fr 1.34fr;align-items:center;gap:36px;display:grid}.hero-left.jsx-a22599fa77661422{z-index:10}.hero-pills-row.jsx-a22599fa77661422{grid-template-columns:repeat(4,1fr);gap:12px;max-width:520px;display:grid}.benefit-pill.jsx-a22599fa77661422{background:#fff;border:1px solid #e2e8f0;border-radius:12px;align-items:center;gap:8px;padding:8px 10px;transition:all .2s cubic-bezier(.16,1,.3,1);display:flex;box-shadow:0 2px 6px #0f172a08}.benefit-pill.jsx-a22599fa77661422:hover{border-color:#22c55e;transform:translateY(-3px);box-shadow:0 8px 16px #0f172a14}.pill-icon-box.jsx-a22599fa77661422{border-radius:8px;flex-shrink:0;justify-content:center;align-items:center;width:28px;height:28px;display:flex}.pill-title.jsx-a22599fa77661422{color:#0f172a;font-size:11px;font-weight:700;line-height:1.2}.pill-sub.jsx-a22599fa77661422{color:#64748b;font-size:10px;line-height:1.1}.showcase-wrapper.jsx-a22599fa77661422{justify-content:center;align-items:center;display:flex;position:relative}.laptop-container.jsx-a22599fa77661422{filter:drop-shadow(0 25px 45px #0f172a2e);cursor:pointer;width:100%;max-width:575px;transition:transform .3s}.laptop-container.jsx-a22599fa77661422:hover{filter:drop-shadow(0 30px 55px #2a195c40)}.laptop-lid.jsx-a22599fa77661422{background:#1e293b;border-radius:16px 16px 2px 2px;padding:8px 8px 6px;position:relative;box-shadow:inset 0 1px 1.5px #ffffff40}.laptop-camera-bar.jsx-a22599fa77661422{justify-content:center;align-items:center;height:8px;margin-bottom:4px;display:flex}.laptop-camera-lens.jsx-a22599fa77661422{background:#334155;border-radius:50%;width:4px;height:4px;box-shadow:0 0 0 1.5px #0f172a}.laptop-screen.jsx-a22599fa77661422{aspect-ratio:16/10;background:#0f172a;border:1px solid #0f172a;border-radius:6px;position:relative;overflow:hidden}.laptop-screen-img.jsx-a22599fa77661422{object-fit:cover;width:100%;height:100%;image-rendering:-webkit-optimize-contrast;transition:transform .4s;display:block}.laptop-container.jsx-a22599fa77661422:hover .laptop-screen-img.jsx-a22599fa77661422{transform:scale(1.02)}.screen-zoom-hint.jsx-a22599fa77661422{-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);color:#fff;opacity:0;background:#0f172abf;border:1px solid #fff3;border-radius:9999px;align-items:center;gap:5px;padding:3px 8px;font-size:10px;font-weight:700;transition:opacity .2s;display:flex;position:absolute;bottom:10px;left:12px}.laptop-container.jsx-a22599fa77661422:hover .screen-zoom-hint.jsx-a22599fa77661422{opacity:1}.laptop-base.jsx-a22599fa77661422{background:linear-gradient(#94a3b8 0%,#64748b 40%,#475569 100%);border-radius:0 0 16px 16px;height:13px;position:relative;box-shadow:0 10px 22px #0f172a38}.laptop-base.jsx-a22599fa77661422:after{content:"";background:#334155;border-radius:0 0 5px 5px;width:76px;height:4px;position:absolute;top:0;left:50%;transform:translate(-50%)}.phone-container.jsx-a22599fa77661422{z-index:20;cursor:pointer;background:#0f172a;border-radius:30px;width:175px;padding:6px;transition:all .3s cubic-bezier(.16,1,.3,1);position:absolute;bottom:-18px;right:-16px;box-shadow:0 28px 45px -8px #0f172a73,0 0 0 1.5px #fff3}.phone-container.jsx-a22599fa77661422:hover{box-shadow:0 35px 55px -6px #2a195c73;transform:translateY(-16px)rotate(0)scale(1.05)!important}.phone-notch.jsx-a22599fa77661422{background:#000;border-radius:0 0 7px 7px;justify-content:center;align-items:center;width:44px;height:8px;margin:0 auto 3px;display:flex}.phone-speaker.jsx-a22599fa77661422{background:#334155;border-radius:1px;width:16px;height:2px}.phone-screen.jsx-a22599fa77661422{aspect-ratio:9/19.2;background:#fff;border-radius:24px;position:relative;overflow:hidden}.phone-screen-img.jsx-a22599fa77661422{object-fit:cover;width:100%;height:100%;display:block}.phone-zoom-hint.jsx-a22599fa77661422{-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);color:#fff;white-space:nowrap;opacity:0;background:#0f172acc;border-radius:9999px;align-items:center;gap:4px;padding:2px 7px;font-size:9px;font-weight:700;transition:opacity .2s;display:flex;position:absolute;top:10px;left:50%;transform:translate(-50%)}.phone-container.jsx-a22599fa77661422:hover .phone-zoom-hint.jsx-a22599fa77661422{opacity:1}.hero-callout-script.jsx-a22599fa77661422{color:#1e293b;pointer-events:none;text-shadow:0 1px 2px #ffffffe6;z-index:25;font-size:20px;line-height:1.1;position:absolute;top:24px;right:-36px}@media (width<=1100px){.hero-grid.jsx-a22599fa77661422{grid-template-columns:1fr;gap:46px}.hero-left.jsx-a22599fa77661422{text-align:center;flex-direction:column;align-items:center;display:flex}.hero-pills-row.jsx-a22599fa77661422{margin:0 auto}.hero-callout-script.jsx-a22599fa77661422{display:none}}@media (width<=640px){.hero-left.jsx-a22599fa77661422 h1.jsx-a22599fa77661422{font-size:38px!important}.hero-pills-row.jsx-a22599fa77661422{grid-template-columns:repeat(2,1fr)}.phone-container.jsx-a22599fa77661422{width:135px;bottom:-8px;right:-8px}}'
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/saas-website/src/components/Hero.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_s(Hero, "GAeC5lHf5gA/i2yOuWrmfKq4zz8=");
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/Features.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Features
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const CORE_FEATURES = [
    {
        id: 'fleet',
        title: 'Fleet Management',
        description: 'Track, monitor and manage your entire EV fleet in real time with precision GPS and remote lock.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#2563EB",
            strokeWidth: "2.2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "2",
                    y: "7",
                    width: "20",
                    height: "14",
                    rx: "2"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/Features.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bgColor: '#EFF6FF',
        badge: 'Live GPS'
    },
    {
        id: 'riders',
        title: 'Rider Management',
        description: 'Onboard, verify and manage riders with instant Aadhaar/DL verification and ride history.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#0284C7",
            strokeWidth: "2.2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "9",
                    cy: "7",
                    r: "4"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M23 21v-2a4 4 0 0 0-3-3.87"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M16 3.13a4 4 0 0 1 0 7.75"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/Features.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bgColor: '#F0F9FF',
        badge: '60s KYC'
    },
    {
        id: 'battery',
        title: 'Battery Operations',
        description: 'Manage battery inventory, swaps, charge cycles, SOH health index and thermal diagnostics.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#16A34A",
            strokeWidth: "2.2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "2",
                    y: "7",
                    width: "16",
                    height: "10",
                    rx: "2",
                    ry: "2"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "22",
                    y1: "11",
                    x2: "22",
                    y2: "13"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "6",
                    y1: "11",
                    x2: "6",
                    y2: "13"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "10",
                    y1: "11",
                    x2: "10",
                    y2: "13"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/Features.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bgColor: '#F0FDF4',
        badge: 'Smart BMS'
    },
    {
        id: 'rental',
        title: 'Rental & Booking',
        description: 'Flexible rental plans (Daily, Weekly, Monthly) with automated security deposit refunds.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#7C3AED",
            strokeWidth: "2.2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "3",
                    y: "4",
                    width: "18",
                    height: "18",
                    rx: "2",
                    ry: "2"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "16",
                    y1: "2",
                    x2: "16",
                    y2: "6"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "8",
                    y1: "2",
                    x2: "8",
                    y2: "6"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "3",
                    y1: "10",
                    x2: "21",
                    y2: "10"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/Features.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bgColor: '#FAF5FF',
        badge: 'Flexible Plans'
    },
    {
        id: 'maintenance',
        title: 'Maintenance Management',
        description: 'Automated service schedules, digital job cards, spare parts inventory and mechanic logs.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#9333EA",
            strokeWidth: "2.2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            }, void 0, false, {
                fileName: "[project]/saas-website/src/components/Features.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/saas-website/src/components/Features.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bgColor: '#FAF5FF',
        badge: 'Zero Downtime'
    },
    {
        id: 'billing',
        title: 'Payments & Billing',
        description: 'Automated billing, GST invoices, multi-gateway integration and instant ICICI corporate payouts.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#0D9488",
            strokeWidth: "2.2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "1",
                    y: "4",
                    width: "22",
                    height: "16",
                    rx: "2",
                    ry: "2"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "1",
                    y1: "10",
                    x2: "23",
                    y2: "10"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/Features.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bgColor: '#F0FDFA',
        badge: 'Auto Settlement'
    },
    {
        id: 'analytics',
        title: 'Analytics & Reports',
        description: 'Real-time revenue metrics, fleet utilization, CO2 carbon credits and automated audit exports.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#D97706",
            strokeWidth: "2.2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "18",
                    y1: "20",
                    x2: "18",
                    y2: "10"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    y1: "20",
                    x2: "12",
                    y2: "4"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "6",
                    y1: "20",
                    x2: "6",
                    y2: "14"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/Features.tsx",
            lineNumber: 97,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bgColor: '#FFFBEB',
        badge: 'Real-Time Insights'
    },
    {
        id: 'multilocation',
        title: 'Multi-Location Support',
        description: 'Manage multiple zones, franchise stations, master depots and cities from a unified console.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#059669",
            strokeWidth: "2.2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "10",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/Features.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/Features.tsx",
            lineNumber: 111,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bgColor: '#ECFDF5',
        badge: 'Multi-Zone'
    }
];
const DEEP_DIVE_MODULES = [
    {
        id: 'telematics',
        tabName: 'Fleet Telematics & Geofencing',
        tagline: 'Precision 2-Second GPS Tracking with Geofence Perimeter Security',
        description: 'Monitor vehicle velocity, battery depletion rates, rider route corridors, and instant unauthorized movement alerts. Remotely immobilize scooters if geofence perimeter is breached.',
        metrics: [
            {
                label: 'GPS Ping Rate',
                val: '2.0 sec'
            },
            {
                label: 'Location Accuracy',
                val: '< 2.5 meters'
            },
            {
                label: 'Remote Immobilizer',
                val: '< 500 ms SLA'
            },
            {
                label: 'Geofence Breach Alert',
                val: 'Instant SMS & Push'
            }
        ],
        checklist: [
            'Multi-Polygon geofenced zone boundary definitions',
            'Remote speed governor (City: 25 km/h, Cargo: 45 km/h)',
            'Crash, fall & abrupt deceleration IMU sensor alerts',
            'Over-The-Air (FOTA) telemetry firmware upgrades'
        ],
        previewTitle: 'Fleet Telematics Console',
        previewBadge: 'Live Stream Active'
    },
    {
        id: 'bms',
        tabName: 'BMS Battery Swap Station Hub',
        tagline: 'Intelligent Cabinet Locker Management with Health-Index Diagnostics',
        description: 'Connects directly with your battery swap stations. Manages 8-bay locker cabinets, authenticates riders via QR scan in under 60 seconds, and measures individual cell voltages and temperatures.',
        metrics: [
            {
                label: 'Swap Turnaround',
                val: '< 55 seconds'
            },
            {
                label: 'Cabinet Bays',
                val: '8 Docks / Station'
            },
            {
                label: 'Thermal Safety Cutoff',
                val: '48°C Trigger'
            },
            {
                label: 'Avg. Battery SOH',
                val: '97.2% Fleet Health'
            }
        ],
        checklist: [
            'Automated locker door latch release upon rider verification',
            'Dual-chemistry support (60V / 30Ah & 72V / 40Ah Li-ion)',
            'Cell imbalance and degraded string auto-isolation',
            'Automated swap invoicing linked to rider digital wallet'
        ],
        previewTitle: 'Smart Swap Dock Telemetry',
        previewBadge: '6 Bays Ready for Swap'
    },
    {
        id: 'kyc',
        tabName: 'Automated Rider Onboarding & KYC',
        tagline: 'Frictionless Paperless Onboarding Verified in Under 60 Seconds',
        description: 'Integrated with government identity databases for instant Aadhaar QR verification, DigiLocker KYC, and driving license validation. Eliminates fraud and physical paperwork.',
        metrics: [
            {
                label: 'Verification Speed',
                val: '< 60 Seconds'
            },
            {
                label: 'KYC Success Rate',
                val: '98.6%'
            },
            {
                label: 'Document Fraud Catch',
                val: '100% Zero-Trust'
            },
            {
                label: 'Digital Agreement',
                val: 'Auto E-Sign'
            }
        ],
        checklist: [
            'Aadhaar OCR & live biometric selfie match',
            'Driving License status verification via Parivahan API',
            'Custom deposit rules and risk scoring algorithm',
            'Instant WhatsApp rental confirmation and onboarding receipt'
        ],
        previewTitle: 'Automated KYC Engine',
        previewBadge: 'DigiLocker Verified'
    },
    {
        id: 'billing',
        tabName: 'Subscriptions & ICICI Settlements',
        tagline: 'Automated Multi-Tenant Billing with Instant Split Payouts',
        description: 'Handle recurring daily, weekly, monthly packages with automated security deposit refunds and franchise commission splits directly disbursed through ICICI E-Collect.',
        metrics: [
            {
                label: 'Payment Methods',
                val: 'UPI, Cards, NetBanking'
            },
            {
                label: 'Franchise Split',
                val: 'Automated Daily/Monthly'
            },
            {
                label: 'Deposit Refund SLA',
                val: 'Instant on Return'
            },
            {
                label: 'GST Compliance',
                val: 'Auto E-Invoices'
            }
        ],
        checklist: [
            'Daily, Weekly, and Monthly rental package plans',
            'Automated security deposit deduction and instant return credit',
            'Multi-franchise commission split calculation and disbursement',
            'Automated reconciliation with bank statement export'
        ],
        previewTitle: 'Financial Billing & Payout Hub',
        previewBadge: 'ICICI E-Collect Integrated'
    }
];
function Features({ onRequestDemo }) {
    _s();
    const [activeModule, setActiveModule] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "features",
        style: {
            padding: '75px 0',
            backgroundColor: '#FFFFFF',
            position: 'relative'
        },
        className: "jsx-e907799830b6eb03",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-e907799830b6eb03" + " " + "container-custom",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            marginBottom: '38px',
                            flexWrap: 'wrap',
                            gap: '16px'
                        },
                        className: "jsx-e907799830b6eb03",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e907799830b6eb03",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-e907799830b6eb03" + " " + "section-tag",
                                        children: "BUILT FOR SCALE"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-e907799830b6eb03" + " " + "section-heading",
                                        children: "Enterprise Features"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 214,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-e907799830b6eb03" + " " + "section-subheading",
                                        children: "Everything you need to operate, automate, and grow your EV fleet business."
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 215,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onRequestDemo('All Enterprise Features'),
                                style: {
                                    padding: '10px 22px',
                                    fontSize: '13.5px'
                                },
                                className: "jsx-e907799830b6eb03" + " " + "btn-secondary",
                                children: [
                                    "Explore All Features",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "15",
                                        height: "15",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        className: "jsx-e907799830b6eb03",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "5",
                                                y1: "12",
                                                x2: "19",
                                                y2: "12",
                                                className: "jsx-e907799830b6eb03"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                lineNumber: 227,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "12 5 19 12 12 19",
                                                className: "jsx-e907799830b6eb03"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                lineNumber: 228,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 226,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/Features.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-e907799830b6eb03" + " " + "features-grid",
                        children: CORE_FEATURES.map((feat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>onRequestDemo(feat.title),
                                className: "jsx-e907799830b6eb03" + " " + "feature-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '14px'
                                        },
                                        className: "jsx-e907799830b6eb03",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '46px',
                                                    height: '46px',
                                                    borderRadius: '12px',
                                                    backgroundColor: feat.bgColor,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'transform 0.2s ease'
                                                },
                                                className: "jsx-e907799830b6eb03" + " " + "feat-icon-box",
                                                children: feat.icon
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                lineNumber: 242,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '10.5px',
                                                    fontWeight: 700,
                                                    color: '#64748B',
                                                    background: '#F1F5F9',
                                                    padding: '2px 8px',
                                                    borderRadius: '9999px'
                                                },
                                                className: "jsx-e907799830b6eb03",
                                                children: feat.badge
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                lineNumber: 257,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: 800,
                                            color: '#0F172A',
                                            marginBottom: '6px'
                                        },
                                        className: "jsx-e907799830b6eb03",
                                        children: feat.title
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '13px',
                                            color: '#64748B',
                                            lineHeight: '1.5',
                                            margin: 0
                                        },
                                        className: "jsx-e907799830b6eb03",
                                        children: feat.description
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, feat.title, true, {
                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                lineNumber: 236,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/Features.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-e907799830b6eb03" + " " + "deep-dive-box",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    marginBottom: '28px'
                                },
                                className: "jsx-e907799830b6eb03",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-e907799830b6eb03" + " " + "section-tag",
                                        children: "ARCHITECTURE DEEP DIVE"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 277,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontFamily: 'Outfit, sans-serif',
                                            fontSize: '26px',
                                            fontWeight: 800,
                                            color: '#0F172A',
                                            margin: '4px 0'
                                        },
                                        className: "jsx-e907799830b6eb03",
                                        children: "Built for Real Indian EV Operations & Extreme Scale"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '14px',
                                            color: '#64748B',
                                            maxWidth: '600px',
                                            margin: '0 auto'
                                        },
                                        className: "jsx-e907799830b6eb03",
                                        children: "Click through the modules below to see how Evegah handles real-world fleet telemetry, battery swaps, and automated payouts."
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                lineNumber: 276,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e907799830b6eb03" + " " + "module-tabs-nav",
                                children: DEEP_DIVE_MODULES.map((mod, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveModule(idx),
                                        className: "jsx-e907799830b6eb03" + " " + `module-tab-btn ${activeModule === idx ? 'active' : ''}`,
                                        children: mod.tabName
                                    }, mod.id, false, {
                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                        lineNumber: 289,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                lineNumber: 287,
                                columnNumber: 11
                            }, this),
                            (()=>{
                                const mod = DEEP_DIVE_MODULES[activeModule];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-e907799830b6eb03" + " " + "module-showcase-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-e907799830b6eb03" + " " + "module-left-info",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        color: '#16A34A',
                                                        background: '#DCFCE7',
                                                        padding: '2px 10px',
                                                        borderRadius: '9999px',
                                                        marginBottom: '10px'
                                                    },
                                                    className: "jsx-e907799830b6eb03",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                width: '6px',
                                                                height: '6px',
                                                                borderRadius: '50%',
                                                                background: '#16A34A'
                                                            },
                                                            className: "jsx-e907799830b6eb03" + " " + "animate-pulse-dot"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Features.tsx",
                                                            lineNumber: 306,
                                                            columnNumber: 21
                                                        }, this),
                                                        mod.previewBadge
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    style: {
                                                        fontFamily: 'Outfit, sans-serif',
                                                        fontSize: '22px',
                                                        fontWeight: 800,
                                                        color: '#0F172A',
                                                        lineHeight: 1.25,
                                                        marginBottom: '8px'
                                                    },
                                                    className: "jsx-e907799830b6eb03",
                                                    children: mod.tagline
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                    lineNumber: 310,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '13.5px',
                                                        color: '#475569',
                                                        lineHeight: '1.6',
                                                        marginBottom: '20px'
                                                    },
                                                    className: "jsx-e907799830b6eb03",
                                                    children: mod.description
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                    lineNumber: 313,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-e907799830b6eb03" + " " + "module-metrics-grid",
                                                    children: mod.metrics.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-e907799830b6eb03" + " " + "mod-metric-box",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-e907799830b6eb03" + " " + "mod-metric-label",
                                                                    children: m.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                    lineNumber: 321,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    className: "jsx-e907799830b6eb03" + " " + "mod-metric-val",
                                                                    children: m.val
                                                                }, void 0, false, {
                                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                    lineNumber: 322,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, m.label, true, {
                                                            fileName: "[project]/saas-website/src/components/Features.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-e907799830b6eb03" + " " + "mod-checklist",
                                                    children: mod.checklist.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-e907799830b6eb03" + " " + "mod-check-item",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    width: "16",
                                                                    height: "16",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "#16A34A",
                                                                    strokeWidth: "2.5",
                                                                    className: "jsx-e907799830b6eb03",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                        points: "20 6 9 17 4 12",
                                                                        className: "jsx-e907799830b6eb03"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 331,
                                                                        columnNumber: 120
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                    lineNumber: 331,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-e907799830b6eb03",
                                                                    children: item
                                                                }, void 0, false, {
                                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, item, true, {
                                                            fileName: "[project]/saas-website/src/components/Features.tsx",
                                                            lineNumber: 330,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>onRequestDemo(mod.tabName),
                                                    style: {
                                                        marginTop: '22px',
                                                        width: 'fit-content',
                                                        padding: '11px 22px',
                                                        fontSize: '13.5px'
                                                    },
                                                    className: "jsx-e907799830b6eb03" + " " + "btn-primary",
                                                    children: "Schedule Walkthrough for this Feature →"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/Features.tsx",
                                            lineNumber: 304,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-e907799830b6eb03" + " " + "module-right-preview",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e907799830b6eb03" + " " + "preview-terminal-frame",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e907799830b6eb03" + " " + "preview-bar",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    gap: '5px'
                                                                },
                                                                className: "jsx-e907799830b6eb03",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            width: '8px',
                                                                            height: '8px',
                                                                            borderRadius: '50%',
                                                                            background: '#EF4444'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 351,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            width: '8px',
                                                                            height: '8px',
                                                                            borderRadius: '50%',
                                                                            background: '#F59E0B'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 352,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            width: '8px',
                                                                            height: '8px',
                                                                            borderRadius: '50%',
                                                                            background: '#10B981'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 353,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                lineNumber: 350,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '11px',
                                                                    fontWeight: 700,
                                                                    color: '#CBD5E1'
                                                                },
                                                                className: "jsx-e907799830b6eb03",
                                                                children: mod.previewTitle
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                lineNumber: 355,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e907799830b6eb03" + " " + "preview-body",
                                                        children: [
                                                            mod.id === 'telematics' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-e907799830b6eb03" + " " + "telematics-mock",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            marginBottom: '10px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        style: {
                                                                                            fontSize: '13px',
                                                                                            color: '#FFFFFF'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "GJ06-EV-1025"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 363,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '10px',
                                                                                            color: '#94A3B8'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "Evegah City 60V • Rider: Rakesh Solanki"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 364,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 362,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: '10px',
                                                                                    fontWeight: 800,
                                                                                    color: '#22C55E',
                                                                                    background: 'rgba(34, 197, 94, 0.18)',
                                                                                    padding: '2px 8px',
                                                                                    borderRadius: '4px'
                                                                                },
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: "INSIDE GEOFENCE"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 366,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 361,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            background: '#0F172A',
                                                                            borderRadius: '8px',
                                                                            padding: '12px',
                                                                            display: 'grid',
                                                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                                                            gap: '8px',
                                                                            marginBottom: '12px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        style: {
                                                                                            fontSize: '9.5px',
                                                                                            color: '#64748B'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "SPEED"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 373,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '16px',
                                                                                            fontWeight: 800,
                                                                                            color: '#FFFFFF'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "34 km/h"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 374,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 372,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        style: {
                                                                                            fontSize: '9.5px',
                                                                                            color: '#64748B'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "BATTERY SOC"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 377,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '16px',
                                                                                            fontWeight: 800,
                                                                                            color: '#22C55E'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "88%"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 378,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 376,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        style: {
                                                                                            fontSize: '9.5px',
                                                                                            color: '#64748B'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "RANGE EST."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 381,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '16px',
                                                                                            fontWeight: 800,
                                                                                            color: '#38BDF8'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "74 km"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 382,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 380,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 371,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: '11px',
                                                                            color: '#94A3B8',
                                                                            borderTop: '1px solid #334155',
                                                                            paddingTop: '8px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: "📍 GPS: 22.2882° N, 73.1974° E • Heading: North-West • Signal: -62 dBm LTE-M"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 386,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                lineNumber: 360,
                                                                columnNumber: 25
                                                            }, this),
                                                            mod.id === 'bms' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-e907799830b6eb03" + " " + "bms-mock",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            marginBottom: '10px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        style: {
                                                                                            fontSize: '13px',
                                                                                            color: '#FFFFFF'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "Station Cabinet #01"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 396,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '10px',
                                                                                            color: '#94A3B8'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "Manjalpur Hub • 8 Locker Bays"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 397,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 395,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: '10px',
                                                                                    fontWeight: 800,
                                                                                    color: '#22C55E',
                                                                                    background: 'rgba(34, 197, 94, 0.18)',
                                                                                    padding: '2px 8px',
                                                                                    borderRadius: '4px'
                                                                                },
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: "STATION ONLINE"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 399,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 394,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'grid',
                                                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                                                            gap: '6px',
                                                                            marginBottom: '10px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            {
                                                                                bay: 'Bay 1',
                                                                                soc: '100%',
                                                                                status: 'Ready',
                                                                                color: '#22C55E'
                                                                            },
                                                                            {
                                                                                bay: 'Bay 2',
                                                                                soc: '98%',
                                                                                status: 'Ready',
                                                                                color: '#22C55E'
                                                                            },
                                                                            {
                                                                                bay: 'Bay 3',
                                                                                soc: '95%',
                                                                                status: 'Ready',
                                                                                color: '#22C55E'
                                                                            },
                                                                            {
                                                                                bay: 'Bay 4',
                                                                                soc: '84%',
                                                                                status: 'Charging',
                                                                                color: '#F59E0B'
                                                                            },
                                                                            {
                                                                                bay: 'Bay 5',
                                                                                soc: '68%',
                                                                                status: 'Charging',
                                                                                color: '#F59E0B'
                                                                            },
                                                                            {
                                                                                bay: 'Bay 6',
                                                                                soc: '100%',
                                                                                status: 'Ready',
                                                                                color: '#22C55E'
                                                                            },
                                                                            {
                                                                                bay: 'Bay 7',
                                                                                soc: 'Empty',
                                                                                status: 'Inward',
                                                                                color: '#64748B'
                                                                            },
                                                                            {
                                                                                bay: 'Bay 8',
                                                                                soc: '100%',
                                                                                status: 'Ready',
                                                                                color: '#22C55E'
                                                                            }
                                                                        ].map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    background: '#0F172A',
                                                                                    padding: '6px',
                                                                                    borderRadius: '6px',
                                                                                    textAlign: 'center'
                                                                                },
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        style: {
                                                                                            fontSize: '8.5px',
                                                                                            color: '#64748B'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: b.bay
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 416,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '11px',
                                                                                            fontWeight: 800,
                                                                                            color: b.color
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: b.soc
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 417,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, b.bay, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 415,
                                                                                columnNumber: 31
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 404,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: '10.5px',
                                                                            color: '#94A3B8',
                                                                            borderTop: '1px solid #334155',
                                                                            paddingTop: '8px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            "⚡ Swaps Completed Today: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: "48 Swaps"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 423,
                                                                                columnNumber: 54
                                                                            }, this),
                                                                            " • Avg Swap Duration: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: "42 secs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 423,
                                                                                columnNumber: 106
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 422,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                lineNumber: 393,
                                                                columnNumber: 25
                                                            }, this),
                                                            mod.id === 'kyc' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-e907799830b6eb03" + " " + "kyc-mock",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            marginBottom: '10px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        style: {
                                                                                            fontSize: '13px',
                                                                                            color: '#FFFFFF'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "Instant KYC Engine"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 432,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '10px',
                                                                                            color: '#94A3B8'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "Zero Manual Intervention"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 433,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 431,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: '10px',
                                                                                    fontWeight: 800,
                                                                                    color: '#22C55E',
                                                                                    background: 'rgba(34, 197, 94, 0.18)',
                                                                                    padding: '2px 8px',
                                                                                    borderRadius: '4px'
                                                                                },
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: "VERIFIED APPROVED"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 435,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 430,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            gap: '6px',
                                                                            marginBottom: '10px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            {
                                                                                doc: 'Aadhaar QR Verified',
                                                                                status: 'UIDAI Authenticated',
                                                                                pass: true
                                                                            },
                                                                            {
                                                                                doc: 'Driving License Status',
                                                                                status: 'Parivahan Validated (Active)',
                                                                                pass: true
                                                                            },
                                                                            {
                                                                                doc: 'Facial Biometric Match',
                                                                                status: '99.4% Face Confidence',
                                                                                pass: true
                                                                            },
                                                                            {
                                                                                doc: 'E-Sign Rental Contract',
                                                                                status: 'IP & Timestamp Signed',
                                                                                pass: true
                                                                            }
                                                                        ].map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    background: '#0F172A',
                                                                                    padding: '6px 10px',
                                                                                    borderRadius: '6px',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'space-between',
                                                                                    alignItems: 'center'
                                                                                },
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        style: {
                                                                                            fontSize: '11px',
                                                                                            color: '#FFFFFF',
                                                                                            fontWeight: 600
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: k.doc
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 448,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        style: {
                                                                                            fontSize: '9.5px',
                                                                                            color: '#22C55E',
                                                                                            fontWeight: 700
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: [
                                                                                            "✓ ",
                                                                                            k.status
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 449,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, k.doc, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 447,
                                                                                columnNumber: 31
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 440,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                lineNumber: 429,
                                                                columnNumber: 25
                                                            }, this),
                                                            mod.id === 'billing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-e907799830b6eb03" + " " + "billing-mock",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            marginBottom: '10px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        style: {
                                                                                            fontSize: '13px',
                                                                                            color: '#FFFFFF'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "ICICI Payout Ledger"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 460,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '10px',
                                                                                            color: '#94A3B8'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "Automated Corporate Disbursement"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 461,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 459,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: '10px',
                                                                                    fontWeight: 800,
                                                                                    color: '#38BDF8',
                                                                                    background: 'rgba(56, 189, 248, 0.18)',
                                                                                    padding: '2px 8px',
                                                                                    borderRadius: '4px'
                                                                                },
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: "E-COLLECT API"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 463,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 458,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'grid',
                                                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                                                            gap: '8px',
                                                                            marginBottom: '10px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    background: '#0F172A',
                                                                                    padding: '8px',
                                                                                    borderRadius: '6px'
                                                                                },
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        style: {
                                                                                            fontSize: '9.5px',
                                                                                            color: '#64748B'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "DAILY REVENUE"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 470,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '14px',
                                                                                            fontWeight: 800,
                                                                                            color: '#22C55E'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "₹68,450"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 471,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 469,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    background: '#0F172A',
                                                                                    padding: '8px',
                                                                                    borderRadius: '6px'
                                                                                },
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        style: {
                                                                                            fontSize: '9.5px',
                                                                                            color: '#64748B'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "FRANCHISE SPLIT"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 474,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '14px',
                                                                                            fontWeight: 800,
                                                                                            color: '#FFFFFF'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "₹17,112"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 475,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 473,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    background: '#0F172A',
                                                                                    padding: '8px',
                                                                                    borderRadius: '6px'
                                                                                },
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        style: {
                                                                                            fontSize: '9.5px',
                                                                                            color: '#64748B'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "DEPOSIT POOL"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 478,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            fontSize: '14px',
                                                                                            fontWeight: 800,
                                                                                            color: '#A855F7'
                                                                                        },
                                                                                        className: "jsx-e907799830b6eb03",
                                                                                        children: "₹5,40,000"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                        lineNumber: 479,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 477,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 468,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: '10.5px',
                                                                            color: '#94A3B8',
                                                                            borderTop: '1px solid #334155',
                                                                            paddingTop: '8px'
                                                                        },
                                                                        className: "jsx-e907799830b6eb03",
                                                                        children: [
                                                                            "🏦 Next Settlement: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: "Friday, 10:00 AM IST"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 484,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            " • Bank: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                className: "jsx-e907799830b6eb03",
                                                                                children: "ICICI Corporate CMS"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                                lineNumber: 484,
                                                                                columnNumber: 100
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                        lineNumber: 483,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                                lineNumber: 457,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/Features.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Features.tsx",
                                                lineNumber: 348,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/Features.tsx",
                                            lineNumber: 347,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/Features.tsx",
                                    lineNumber: 303,
                                    columnNumber: 15
                                }, this);
                            })()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/Features.tsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/components/Features.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "e907799830b6eb03",
                children: ".features-grid.jsx-e907799830b6eb03{grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:50px;display:grid}.feature-card.jsx-e907799830b6eb03{cursor:pointer;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px 20px;transition:all .25s cubic-bezier(.16,1,.3,1);box-shadow:0 2px 6px #0f172a05}.feature-card.jsx-e907799830b6eb03:hover{border-color:#2a195c;transform:translateY(-4px);box-shadow:0 12px 28px #0f172a14}.feature-card.jsx-e907799830b6eb03:hover .feat-icon-box{transform:scale(1.1)}.deep-dive-box.jsx-e907799830b6eb03{background:#f8fafc;border:1px solid #e2e8f0;border-radius:24px;padding:36px 32px}.module-tabs-nav.jsx-e907799830b6eb03{flex-wrap:wrap;justify-content:center;align-items:center;gap:10px;margin-bottom:28px;display:flex}.module-tab-btn.jsx-e907799830b6eb03{color:#475569;cursor:pointer;background:#fff;border:1.5px solid #cbd5e1;border-radius:9999px;padding:10px 20px;font-size:13px;font-weight:700;transition:all .2s}.module-tab-btn.jsx-e907799830b6eb03:hover{color:#2a195c;border-color:#2a195c}.module-tab-btn.active.jsx-e907799830b6eb03{color:#fff;background:#2a195c;border-color:#2a195c;box-shadow:0 4px 12px #2a195c40}.module-showcase-card.jsx-e907799830b6eb03{background:#fff;border:1px solid #e2e8f0;border-radius:20px;grid-template-columns:1.2fr 1fr;align-items:center;gap:36px;padding:36px 34px;display:grid;box-shadow:0 8px 24px #0f172a0a}.module-metrics-grid.jsx-e907799830b6eb03{grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:18px;display:grid}.mod-metric-box.jsx-e907799830b6eb03{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;flex-direction:column;padding:10px 12px;display:flex}.mod-metric-label.jsx-e907799830b6eb03{color:#64748b;text-transform:uppercase;font-size:10px;font-weight:700}.mod-metric-val.jsx-e907799830b6eb03{color:#0f172a;margin-top:2px;font-size:16px;font-weight:800}.mod-checklist.jsx-e907799830b6eb03{flex-direction:column;gap:8px;display:flex}.mod-check-item.jsx-e907799830b6eb03{color:#334155;align-items:center;gap:8px;font-size:13px;font-weight:500;display:flex}.preview-terminal-frame.jsx-e907799830b6eb03{background:#1e293b;border:1px solid #334155;border-radius:14px;overflow:hidden;box-shadow:0 16px 36px #0f172a33}.preview-bar.jsx-e907799830b6eb03{background:#0f172a;border-bottom:1px solid #334155;justify-content:space-between;align-items:center;padding:10px 14px;display:flex}.preview-body.jsx-e907799830b6eb03{padding:18px}@media (width<=1024px){.features-grid.jsx-e907799830b6eb03{grid-template-columns:repeat(2,1fr)}.module-showcase-card.jsx-e907799830b6eb03{grid-template-columns:1fr}}@media (width<=640px){.features-grid.jsx-e907799830b6eb03{grid-template-columns:1fr}.deep-dive-box.jsx-e907799830b6eb03{padding:24px 16px}.module-showcase-card.jsx-e907799830b6eb03{padding:20px 16px}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/saas-website/src/components/Features.tsx",
        lineNumber: 208,
        columnNumber: 5
    }, this);
}
_s(Features, "qw5nrKs+R7W+sbFAPec1AZ7gQtI=");
_c = Features;
var _c;
__turbopack_context__.k.register(_c, "Features");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/MobilityInYourHands.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MobilityInYourHands
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function MobilityInYourHands({ onRequestDemo }) {
    _s();
    const [activeScreen, setActiveScreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const screens = [
        {
            id: 'map',
            title: 'Find Nearby Vehicles',
            badge: 'GPS Radar Scan',
            screenContent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    height: '100%',
                    background: '#F8FAFC',
                    color: '#0F172A',
                    padding: '16px 14px',
                    display: 'flex',
                    flexDirection: 'column'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '14px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 800,
                                    color: '#0F172A'
                                },
                                children: "Nearby Evegah Hubs"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 20,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '10px',
                                    background: '#DCFCE7',
                                    color: '#15803D',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontWeight: 800
                                },
                                children: "● 8 Available"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            borderRadius: '14px',
                            background: '#F1F5F9',
                            border: '1.5px solid #E2E8F0',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: 'linear-gradient(#E2E8F0 1.5px, transparent 1.5px), linear-gradient(90deg, #E2E8F0 1.5px, transparent 1.5px)',
                                    backgroundSize: '28px 28px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 41,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: '10%',
                                    right: '10%',
                                    width: '70px',
                                    height: '60px',
                                    background: 'rgba(34, 197, 94, 0.12)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(34, 197, 94, 0.2)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 44,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: '#4F46E5',
                                    border: '3px solid #FFFFFF',
                                    position: 'absolute',
                                    top: '52%',
                                    left: '48%',
                                    boxShadow: '0 2px 10px rgba(79, 70, 229, 0.4)',
                                    zIndex: 3
                                }
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 47,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    background: 'rgba(79, 70, 229, 0.18)',
                                    position: 'absolute',
                                    top: '45%',
                                    left: '41%'
                                }
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: '24%',
                                    left: '26%',
                                    background: '#059669',
                                    color: '#fff',
                                    fontSize: '9.5px',
                                    fontWeight: 800,
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)'
                                },
                                children: "⚡ 98%"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: '34%',
                                    right: '18%',
                                    background: '#059669',
                                    color: '#fff',
                                    fontSize: '9.5px',
                                    fontWeight: 800,
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)'
                                },
                                children: "⚡ 100%"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    bottom: '22%',
                                    left: '22%',
                                    background: '#D97706',
                                    color: '#fff',
                                    fontSize: '9.5px',
                                    fontWeight: 800,
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)'
                                },
                                children: "⚡ 76%"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: '12px',
                            background: '#FFFFFF',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            border: '1.5px solid #E2E8F0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '12px',
                                                fontWeight: 800,
                                                color: '#0F172A'
                                            },
                                            children: "Evegah City • Gotri Hub"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 66,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '10px',
                                                color: '#64748B'
                                            },
                                            children: "120m away • Estimated 110 km range"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '11.5px',
                                        fontWeight: 800,
                                        color: '#059669'
                                    },
                                    children: "₹80/hr"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 69,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                            lineNumber: 64,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this)
        },
        {
            id: 'ride',
            title: 'Ready to Ride',
            badge: 'Keyless NFC/QR Unlock',
            screenContent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    height: '100%',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    padding: '16px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: '#64748B'
                                        },
                                        children: "Vehicle #GJ06EV2098"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '10px',
                                            background: '#EEF2FF',
                                            color: '#4F46E5',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontWeight: 800
                                        },
                                        children: "Bluetooth Linked"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    margin: '6px 0 12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '100px',
                                            height: '100px',
                                            margin: '0 auto',
                                            background: '#F8FAFC',
                                            borderRadius: '50%',
                                            border: '1.5px solid #E2E8F0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "60",
                                            height: "60",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "#4F46E5",
                                            strokeWidth: "1.8",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "5.5",
                                                    cy: "17.5",
                                                    r: "3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "18.5",
                                                    cy: "17.5",
                                                    r: "3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 5.5l3-5.5h3"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M5.5 17.5l4-8h4l2.5 8"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8.5 12h5"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 92,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            fontSize: '15px',
                                            fontWeight: 800,
                                            margin: '6px 0 2px',
                                            color: '#0F172A'
                                        },
                                        children: "Evegah Mink Pro"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '10.5px',
                                            color: '#64748B',
                                            margin: 0
                                        },
                                        children: "Smart Dual-Battery Telemetry"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '8px',
                                    marginBottom: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#F8FAFC',
                                            borderRadius: '10px',
                                            padding: '8px',
                                            border: '1px solid #E2E8F0',
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '9px',
                                                    color: '#64748B',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 700
                                                },
                                                children: "Battery SOC"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 108,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '16px',
                                                    fontWeight: 900,
                                                    color: '#059669'
                                                },
                                                children: "94%"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 109,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#F8FAFC',
                                            borderRadius: '10px',
                                            padding: '8px',
                                            border: '1px solid #E2E8F0',
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '9px',
                                                    color: '#64748B',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 700
                                                },
                                                children: "Est. Range"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 112,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '16px',
                                                    fontWeight: 900,
                                                    color: '#4F46E5'
                                                },
                                                children: "98 km"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 113,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: {
                            width: '100%',
                            padding: '11px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '12.5px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                        },
                        children: "Unlock & Start Ride →"
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this)
        },
        {
            id: 'active',
            title: 'Active Ride Telemetry',
            badge: 'Live Smart BMS',
            screenContent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    height: '100%',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    padding: '16px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '10px',
                                            background: '#DCFCE7',
                                            color: '#15803D',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontWeight: 800
                                        },
                                        children: "● Trip in Progress"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '11px',
                                            color: '#64748B',
                                            fontWeight: 700
                                        },
                                        children: "18 min elapsed"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    margin: '8px 0 14px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '32px',
                                            fontWeight: 900,
                                            color: '#0F172A',
                                            letterSpacing: '-0.02em',
                                            fontFamily: "'Outfit', sans-serif"
                                        },
                                        children: [
                                            "24 ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '13px',
                                                    color: '#64748B',
                                                    fontWeight: 600
                                                },
                                                children: "km/h"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 153,
                                                columnNumber: 20
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10.5px',
                                            color: '#059669',
                                            fontWeight: 800
                                        },
                                        children: "Eco Mode Active • Safe Zone"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '6px',
                                    marginBottom: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#F8FAFC',
                                            borderRadius: '10px',
                                            padding: '7px 4px',
                                            border: '1px solid #E2E8F0',
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '8.5px',
                                                    color: '#64748B',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 700
                                                },
                                                children: "Distance"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12.5px',
                                                    fontWeight: 800,
                                                    color: '#0F172A'
                                                },
                                                children: "6.2 km"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#F8FAFC',
                                            borderRadius: '10px',
                                            padding: '7px 4px',
                                            border: '1px solid #E2E8F0',
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '8.5px',
                                                    color: '#64748B',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 700
                                                },
                                                children: "Battery"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12.5px',
                                                    fontWeight: 800,
                                                    color: '#059669'
                                                },
                                                children: "88%"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 165,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 163,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#F8FAFC',
                                            borderRadius: '10px',
                                            padding: '7px 4px',
                                            border: '1px solid #E2E8F0',
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '8.5px',
                                                    color: '#64748B',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 700
                                                },
                                                children: "CO₂ Saved"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12.5px',
                                                    fontWeight: 800,
                                                    color: '#4F46E5'
                                                },
                                                children: "0.48 kg"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 169,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: {
                            width: '100%',
                            padding: '11px',
                            borderRadius: '12px',
                            background: '#0F172A',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                        },
                        children: "Lock & End Ride"
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, this)
        }
    ];
    const featureList = [
        {
            title: 'Find nearby vehicles',
            desc: 'Real-time GPS radar detects available battery-charged EVs within 250m with instant reservation.',
            icon: '📍'
        },
        {
            title: 'Real-time tracking',
            desc: 'Sub-second telemetry monitoring, live speed capping, safe zone alerts, and anti-theft smart locks.',
            icon: '📡'
        },
        {
            title: 'Easy booking & payments',
            desc: '1-click UPI, Apple Pay, Google Pay, dynamic QR codes, and automatic deposit reconciliation.',
            icon: '💳'
        },
        {
            title: 'Ride history and rewards',
            desc: 'Track trip miles, earn green commute credits, redeem battery swaps, and download tax invoices.',
            icon: '🎁'
        },
        {
            title: 'A cleaner tomorrow, together',
            desc: 'Live personal carbon offset calculator showing kilograms of CO₂ avoided and trees planted.',
            icon: '🌱'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "mobile-app",
        style: {
            padding: '95px 0 90px',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 50%, #F8FAFC 100%)',
            position: 'relative',
            overflow: 'hidden',
            color: '#0F172A'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container-custom",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        maxWidth: '720px',
                        margin: '0 auto 52px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 16px',
                                borderRadius: '30px',
                                background: '#DCFCE7',
                                border: '1px solid #86EFAC',
                                marginBottom: '14px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#059669',
                                        display: 'inline-block'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 238,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '11.5px',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        color: '#166534'
                                    },
                                    children: "Rider Mobile Experience"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                            lineNumber: 237,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: 'clamp(30px, 4.5vw, 46px)',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                                margin: '0 0 12px 0',
                                color: '#0F172A',
                                fontFamily: "'Outfit', sans-serif"
                            },
                            children: [
                                "Mobility",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        background: 'linear-gradient(135deg, #059669 0%, #0284C7 50%, #4F46E5 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'inline-block'
                                    },
                                    children: "in Your Hands"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 255,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '15.5px',
                                color: '#64748B',
                                margin: '0 auto 28px',
                                maxWidth: '600px',
                                lineHeight: 1.6
                            },
                            children: "Designed for riders, field technicians, and hub operators. Native iOS and Android apps with sub-second keyless unlock and real-time battery swap navigation."
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                            lineNumber: 266,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '14px',
                                flexWrap: 'wrap'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 22px',
                                        borderRadius: '14px',
                                        background: '#0F172A',
                                        color: '#FFFFFF',
                                        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.transform = 'translateY(-2px)',
                                    onMouseLeave: (e)=>e.currentTarget.style.transform = 'translateY(0)',
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "22",
                                            height: "22",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24z"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 289,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 288,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: 'left'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '9.5px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.04em',
                                                        opacity: 0.8
                                                    },
                                                    children: "Download on the"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 292,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '13.5px',
                                                        fontWeight: 800
                                                    },
                                                    children: "App Store"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 293,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 291,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 22px',
                                        borderRadius: '14px',
                                        background: '#0F172A',
                                        color: '#FFFFFF',
                                        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.transform = 'translateY(-2px)',
                                    onMouseLeave: (e)=>e.currentTarget.style.transform = 'translateY(0)',
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "22",
                                            height: "22",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.22-.315V2.13c.066-.112.14-.219.22-.315zm11.547 11.548l2.25 2.25-11.455 6.554 9.205-8.804zm2.96-1.708l3.197 1.831a1.27 1.27 0 0 1 0 2.21l-3.197 1.83-2.186-2.186 2.186-2.685zm-2.96-1.708L5.951 1.142l11.455 6.554-2.25 2.25z"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 314,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 313,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: 'left'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '9.5px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.04em',
                                                        opacity: 0.8
                                                    },
                                                    children: "Get it on"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '13.5px',
                                                        fontWeight: 800
                                                    },
                                                    children: "Google Play"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 316,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 297,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                    lineNumber: 236,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '48px',
                        alignItems: 'center'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            },
                            children: featureList.map((feat, idx)=>{
                                const isSelected = activeScreen === idx % 3;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>setActiveScreen(idx % 3),
                                    style: {
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '16px',
                                        padding: '16px 20px',
                                        borderRadius: '18px',
                                        background: isSelected ? '#FFFFFF' : '#FFFFFF',
                                        border: isSelected ? '2px solid #4F46E5' : '1.5px solid #E2E8F0',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                        boxShadow: isSelected ? '0 10px 24px -4px rgba(79, 70, 229, 0.12), 0 2px 6px rgba(0,0,0,0.02)' : '0 2px 6px rgba(0,0,0,0.02)',
                                        transform: isSelected ? 'translateX(6px)' : 'none'
                                    },
                                    onMouseEnter: (e)=>{
                                        if (!isSelected) {
                                            e.currentTarget.style.borderColor = '#CBD5E1';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }
                                    },
                                    onMouseLeave: (e)=>{
                                        if (!isSelected) {
                                            e.currentTarget.style.borderColor = '#E2E8F0';
                                            e.currentTarget.style.transform = 'none';
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '12px',
                                                background: isSelected ? '#EEF2FF' : '#F8FAFC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '20px',
                                                flexShrink: 0,
                                                border: isSelected ? '1px solid #C7D2FE' : '1px solid #E2E8F0'
                                            },
                                            children: feat.icon
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 363,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                flex: 1
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            style: {
                                                                fontSize: '15.5px',
                                                                fontWeight: 800,
                                                                margin: '0 0 4px 0',
                                                                color: isSelected ? '#4F46E5' : '#0F172A'
                                                            },
                                                            children: feat.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                            lineNumber: 382,
                                                            columnNumber: 23
                                                        }, this),
                                                        isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '10px',
                                                                background: '#EEF2FF',
                                                                color: '#4F46E5',
                                                                fontWeight: 800,
                                                                padding: '2px 8px',
                                                                borderRadius: '10px'
                                                            },
                                                            children: "Previewing"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '13px',
                                                        color: '#64748B',
                                                        margin: 0,
                                                        lineHeight: 1.5
                                                    },
                                                    children: feat.desc
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 380,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, feat.title, true, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 332,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                            lineNumber: 328,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        width: '320px',
                                        height: '480px',
                                        borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, rgba(255,255,255,0) 70%)',
                                        pointerEvents: 'none'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 404,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '285px',
                                        height: '560px',
                                        background: '#0F172A',
                                        borderRadius: '44px',
                                        padding: '10px',
                                        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 2px #334155, 0 0 0 4px #0F172A',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'absolute',
                                                top: '18px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '85px',
                                                height: '20px',
                                                background: '#0F172A',
                                                borderRadius: '14px',
                                                zIndex: 10,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                padding: '0 8px'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: '#1E293B',
                                                    border: '1px solid #334155'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                                lineNumber: 447,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 430,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                flex: 1,
                                                background: '#FFFFFF',
                                                borderRadius: '34px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                paddingTop: '28px',
                                                position: 'relative'
                                            },
                                            children: screens[activeScreen]?.screenContent
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 451,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'absolute',
                                                bottom: '14px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '100px',
                                                height: '4px',
                                                background: 'rgba(255,255,255,0.4)',
                                                borderRadius: '4px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                            lineNumber: 467,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                                    lineNumber: 416,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                            lineNumber: 401,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
                    lineNumber: 325,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
            lineNumber: 234,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/saas-website/src/components/MobilityInYourHands.tsx",
        lineNumber: 224,
        columnNumber: 5
    }, this);
}
_s(MobilityInYourHands, "PlcI2MHwSPnuwuYlF+eiPow3Qkc=");
_c = MobilityInYourHands;
var _c;
__turbopack_context__.k.register(_c, "MobilityInYourHands");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/EnterpriseIntegrations.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EnterpriseIntegrations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function EnterpriseIntegrations({ onRequestDemo }) {
    _s();
    const [activeIntegration, setActiveIntegration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('fleet');
    const hubs = [
        {
            id: 'fleet',
            name: 'Fleet Systems',
            subtitle: 'CAN Bus & IoT Telematics',
            icon: '🚗',
            color: '#4F46E5',
            codeSnippet: `// Evegah Fleet IoT Event Stream
const ev = new EvegahClient({ apiKey: 'evg_live_...' });

ev.on('telemetry.bms', (battery) => {
  console.log('Vehicle GJ06EV2098 SOC:', battery.soc);
  // Trigger automatic rapid swap reservation at < 20%
  if (battery.soc < 20) {
    ev.swaps.reserveNearestLocker(battery.vehicleId);
  }
});`
        },
        {
            id: 'payments',
            name: 'Payment Platforms',
            subtitle: 'Razorpay, ICICI UPI & Stripe',
            icon: '💳',
            color: '#059669',
            codeSnippet: `// Instant Deposit & Dynamic QR Settlement
const settlement = await ev.payments.createEscrow({
  riderId: 'RD-9021',
  amount: 1500,
  deposit: 1000,
  method: 'ICICI_UPI_DYNAMIC_QR'
});`
        },
        {
            id: 'maps',
            name: 'Maps & Navigation',
            subtitle: 'Mapbox, Google Maps, OpenStreet',
            icon: '🗺️',
            color: '#0891B2',
            codeSnippet: `// Geofenced Zone Ingress / Egress
ev.zones.createPolygon({
  zoneName: 'Gotri Campus Zone',
  maxSpeedKmh: 25,
  autoSpeedThrottle: true
});`
        },
        {
            id: 'analytics',
            name: 'Analytics Tools',
            subtitle: 'Mixpanel, BigQuery & Datadog',
            icon: '📊',
            color: '#D97706',
            codeSnippet: `// Push Fleet Carbon Offsets to Data Lake
await ev.analytics.exportMetric({
  metric: 'co2_saved_kg',
  totalAvoidedKg: 1420.50,
  granularity: 'hourly'
});`
        },
        {
            id: 'custom',
            name: 'Custom Integrations',
            subtitle: 'SAP ERP, Webhooks & Salesforce',
            icon: '⚙️',
            color: '#DB2777',
            codeSnippet: `// Webhook Event Dispatcher
app.post('/webhooks/evegah', (req, res) => {
  const { event, data } = req.body;
  if (event === 'ride.completed') syncToSAP(data);
});`
        }
    ];
    const highlights = [
        {
            title: 'RESTful APIs',
            desc: 'Sub-50ms query response latency with robust endpoints, Postman collections and end-to-end type safety.'
        },
        {
            title: 'Real-time Webhooks',
            desc: 'Guaranteed at-least-once delivery for ride start, return inspections, battery swaps, and panic alerts.'
        },
        {
            title: 'Developer SDKs',
            desc: 'Native client libraries for Node.js, Python, Go, Dart/Flutter, and complete Swagger OpenAPI specs.'
        },
        {
            title: 'Enterprise Security',
            desc: '99.99% SLA uptime, multi-tenant zone isolation, AES-256 telemetry encryption, and SOC2 compliance.'
        }
    ];
    const selectedHub = hubs.find((h)=>h.id === activeIntegration) || hubs[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "enterprise-integrations",
        style: {
            padding: '95px 0 100px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            position: 'relative',
            overflow: 'hidden',
            color: '#0F172A'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container-custom",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        maxWidth: '720px',
                        margin: '0 auto 52px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 16px',
                                borderRadius: '30px',
                                background: '#EEF2FF',
                                border: '1px solid #C7D2FE',
                                marginBottom: '14px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#4F46E5',
                                        display: 'inline-block'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '11.5px',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        color: '#4338CA'
                                    },
                                    children: "Developer & Enterprise Suite"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: 'clamp(30px, 4.5vw, 46px)',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                                margin: '0 0 12px 0',
                                color: '#0F172A',
                                fontFamily: "'Outfit', sans-serif"
                            },
                            children: [
                                "Enterprise Ready.",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #0284C7 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'inline-block'
                                    },
                                    children: "Open APIs."
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 136,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '15.5px',
                                color: '#64748B',
                                margin: '0 0 26px 0',
                                lineHeight: 1.6
                            },
                            children: "Seamless Integrations. Connect Evegah with your existing ERPs, payment gateways, and hardware IoT telematics in minutes."
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '14px',
                                flexWrap: 'wrap'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://documenter.getpostman.com",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    style: {
                                        padding: '11px 26px',
                                        borderRadius: '30px',
                                        background: '#4F46E5',
                                        color: '#FFFFFF',
                                        textDecoration: 'none',
                                        fontWeight: 800,
                                        fontSize: '13.5px',
                                        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
                                        transition: 'transform 0.2s'
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.transform = 'translateY(-2px)',
                                    onMouseLeave: (e)=>e.currentTarget.style.transform = 'translateY(0)',
                                    children: "View API Docs →"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onRequestDemo,
                                    style: {
                                        padding: '11px 24px',
                                        borderRadius: '30px',
                                        background: '#FFFFFF',
                                        border: '1.5px solid #E2E8F0',
                                        color: '#1E293B',
                                        fontWeight: 700,
                                        fontSize: '13.5px',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                                    },
                                    children: "Request API Key"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: '#FFFFFF',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '24px',
                        padding: '32px',
                        boxShadow: '0 16px 36px -8px rgba(15, 23, 42, 0.06)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '32px',
                        marginBottom: '48px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '11.5px',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        color: '#64748B',
                                        marginBottom: '14px'
                                    },
                                    children: "Select Integration Category"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px'
                                    },
                                    children: hubs.map((hub)=>{
                                        const isSelected = activeIntegration === hub.id;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>setActiveIntegration(hub.id),
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '14px 18px',
                                                borderRadius: '16px',
                                                background: isSelected ? '#F8FAFC' : '#FFFFFF',
                                                border: isSelected ? `2px solid ${hub.color}` : '1.5px solid #E2E8F0',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.04)' : 'none'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '20px'
                                                            },
                                                            children: hub.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                            lineNumber: 235,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: '14.5px',
                                                                        fontWeight: 800,
                                                                        color: isSelected ? hub.color : '#0F172A'
                                                                    },
                                                                    children: hub.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                                    lineNumber: 237,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: '12px',
                                                                        color: '#64748B'
                                                                    },
                                                                    children: hub.subtitle
                                                                }, void 0, false, {
                                                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                                    lineNumber: 240,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                            lineNumber: 236,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '12px',
                                                        fontWeight: 800,
                                                        color: isSelected ? hub.color : '#94A3B8'
                                                    },
                                                    children: isSelected ? '● Active' : 'Select'
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, hub.id, true, {
                                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                            lineNumber: 218,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: '#0F172A',
                                borderRadius: '18px',
                                padding: '20px',
                                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
                                display: 'flex',
                                flexDirection: 'column',
                                fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '14px',
                                        paddingBottom: '12px',
                                        borderBottom: '1px solid #1E293B'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: '#EF4444'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: '#F59E0B'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: '#10B981'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        marginLeft: '10px',
                                                        fontSize: '11px',
                                                        color: '#94A3B8',
                                                        fontFamily: 'sans-serif',
                                                        fontWeight: 600
                                                    },
                                                    children: [
                                                        selectedHub.name,
                                                        ".js"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                            lineNumber: 267,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '10px',
                                                background: 'rgba(79, 70, 229, 0.25)',
                                                color: '#818CF8',
                                                padding: '2px 8px',
                                                borderRadius: '8px',
                                                fontWeight: 700,
                                                fontFamily: 'sans-serif'
                                            },
                                            children: "v2.4 Live SDK"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                            lineNumber: 276,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    style: {
                                        margin: 0,
                                        fontSize: '12.5px',
                                        lineHeight: 1.6,
                                        color: '#E2E8F0',
                                        overflowX: 'auto',
                                        flex: 1
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        children: selectedHub.codeSnippet
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: '14px',
                                        paddingTop: '10px',
                                        borderTop: '1px solid #1E293B',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '11px',
                                                color: '#10B981',
                                                fontFamily: 'sans-serif',
                                                fontWeight: 600
                                            },
                                            children: "● 200 OK • 42ms response"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                            lineNumber: 288,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>navigator.clipboard?.writeText(selectedHub.codeSnippet),
                                            style: {
                                                background: 'rgba(255,255,255,0.1)',
                                                border: 'none',
                                                color: '#FFFFFF',
                                                borderRadius: '6px',
                                                padding: '4px 10px',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                fontFamily: 'sans-serif',
                                                fontWeight: 600
                                            },
                                            children: "Copy Code"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                            lineNumber: 291,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 287,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                            lineNumber: 254,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                    lineNumber: 195,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '18px',
                        marginBottom: '52px'
                    },
                    children: highlights.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: '#FFFFFF',
                                border: '1.5px solid #E2E8F0',
                                borderRadius: '18px',
                                padding: '20px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    style: {
                                        fontSize: '15px',
                                        fontWeight: 800,
                                        margin: '0 0 6px 0',
                                        color: '#0F172A'
                                    },
                                    children: item.title
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 332,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '13px',
                                        color: '#64748B',
                                        margin: 0,
                                        lineHeight: 1.5
                                    },
                                    children: item.desc
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                                    lineNumber: 335,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, item.title, true, {
                            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                            lineNumber: 322,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
                    lineNumber: 313,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
            lineNumber: 115,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/saas-website/src/components/EnterpriseIntegrations.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s(EnterpriseIntegrations, "YcqZR3iArOB6wmzWIie7ZlM5RzY=");
_c = EnterpriseIntegrations;
var _c;
__turbopack_context__.k.register(_c, "EnterpriseIntegrations");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/HowItWorks.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HowItWorks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
;
const STEPS = [
    {
        number: '1',
        title: 'Sign Up',
        desc: 'Create your organization and set up your account.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#16A34A",
            strokeWidth: "2.4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "7",
                    r: "4"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                    lineNumber: 12,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bg: '#DCFCE7',
        numColor: '#16A34A'
    },
    {
        number: '2',
        title: 'Configure',
        desc: 'Add vehicles, zones, users and settings.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#7C3AED",
            strokeWidth: "2.4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bg: '#F3E8FF',
        numColor: '#7C3AED'
    },
    {
        number: '3',
        title: 'Operate',
        desc: 'Manage riders, rentals, battery swaps and more.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#2563EB",
            strokeWidth: "2.4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "5 3 19 12 5 21 5 3"
            }, void 0, false, {
                fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                lineNumber: 37,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bg: '#EFF6FF',
        numColor: '#2563EB'
    },
    {
        number: '4',
        title: 'Grow',
        desc: 'Track performance and scale your business.',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#4F46E5",
            strokeWidth: "2.4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "18",
                    y1: "20",
                    x2: "18",
                    y2: "10"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    y1: "20",
                    x2: "12",
                    y2: "4"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "6",
                    y1: "20",
                    x2: "6",
                    y2: "14"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        bg: '#EEF2FF',
        numColor: '#4F46E5'
    }
];
function HowItWorks() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "how-it-works",
        style: {
            padding: '70px 0',
            backgroundColor: '#F8FAFC',
            position: 'relative'
        },
        className: "jsx-4d2cef861c30f435",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-4d2cef861c30f435" + " " + "container-custom",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: '46px',
                            flexWrap: 'wrap',
                            gap: '20px'
                        },
                        className: "jsx-4d2cef861c30f435",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-4d2cef861c30f435",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-4d2cef861c30f435" + " " + "section-tag",
                                        children: "GET STARTED IN MINUTES"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                        lineNumber: 66,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-4d2cef861c30f435" + " " + "section-heading",
                                        children: "How It Works"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                        lineNumber: 67,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-4d2cef861c30f435" + " " + "section-subheading",
                                        children: "A simple and powerful platform to get your EV operations running."
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-4d2cef861c30f435" + " " + "how-script-box font-script",
                                children: [
                                    "From Setup to Scale",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                        className: "jsx-4d2cef861c30f435"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                        lineNumber: 74,
                                        columnNumber: 32
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: '#16A34A'
                                        },
                                        className: "jsx-4d2cef861c30f435",
                                        children: "We're with You"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-4d2cef861c30f435" + " " + "steps-wrapper",
                        children: STEPS.map((step, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-4d2cef861c30f435" + " " + "step-card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '46px',
                                                    height: '46px',
                                                    borderRadius: '50%',
                                                    backgroundColor: step.bg,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                },
                                                className: "jsx-4d2cef861c30f435",
                                                children: step.icon
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                                lineNumber: 84,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-4d2cef861c30f435" + " " + "step-text-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            marginBottom: '4px'
                                                        },
                                                        className: "jsx-4d2cef861c30f435",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '13px',
                                                                    fontWeight: 800,
                                                                    color: step.numColor
                                                                },
                                                                className: "jsx-4d2cef861c30f435",
                                                                children: step.number
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                                                lineNumber: 101,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                style: {
                                                                    fontSize: '15.5px',
                                                                    fontWeight: 800,
                                                                    color: '#0F172A',
                                                                    margin: 0
                                                                },
                                                                className: "jsx-4d2cef861c30f435",
                                                                children: step.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                                                lineNumber: 104,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            fontSize: '13px',
                                                            color: '#64748B',
                                                            lineHeight: '1.4',
                                                            margin: 0
                                                        },
                                                        className: "jsx-4d2cef861c30f435",
                                                        children: step.desc
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                                lineNumber: 99,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this),
                                    idx < STEPS.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        "aria-hidden": "true",
                                        className: "jsx-4d2cef861c30f435" + " " + "step-arrow",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "20",
                                            height: "20",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "#CBD5E1",
                                            strokeWidth: "2.5",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            className: "jsx-4d2cef861c30f435",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "5",
                                                    y1: "12",
                                                    x2: "19",
                                                    y2: "12",
                                                    className: "jsx-4d2cef861c30f435"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                    points: "12 5 19 12 12 19",
                                                    className: "jsx-4d2cef861c30f435"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                            lineNumber: 116,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, step.number, true, {
                                fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "4d2cef861c30f435",
                children: ".how-script-box.jsx-4d2cef861c30f435{color:#334155;text-align:right;font-size:22px;line-height:1.15;transform:rotate(-3deg)}.steps-wrapper.jsx-4d2cef861c30f435{background:#fff;border:1px solid #e2e8f0;border-radius:18px;justify-content:space-between;align-items:center;gap:12px;padding:24px 28px;display:flex;box-shadow:0 4px 14px #0f172a05}.step-card.jsx-4d2cef861c30f435{flex:1;align-items:center;gap:14px;min-width:0;display:flex}.step-text-wrap.jsx-4d2cef861c30f435{min-width:0}.step-arrow.jsx-4d2cef861c30f435{color:#cbd5e1;flex-shrink:0;justify-content:center;align-items:center;display:flex}@media (width<=1024px){.steps-wrapper.jsx-4d2cef861c30f435{flex-direction:column;align-items:stretch;gap:18px;padding:20px}.step-arrow.jsx-4d2cef861c30f435{margin:-4px 0;transform:rotate(90deg)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/saas-website/src/components/HowItWorks.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c = HowItWorks;
var _c;
__turbopack_context__.k.register(_c, "HowItWorks");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/Pricing.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Pricing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Pricing({ onRequestDemo }) {
    _s();
    const [billingCycle, setBillingCycle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('monthly');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "pricing",
        style: {
            padding: '75px 0',
            backgroundColor: '#FFFFFF'
        },
        className: "jsx-b8d3dbacf1a75d0c",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-b8d3dbacf1a75d0c" + " " + "container-custom",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            marginBottom: '42px',
                            flexWrap: 'wrap',
                            gap: '20px'
                        },
                        className: "jsx-b8d3dbacf1a75d0c",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b8d3dbacf1a75d0c",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "section-tag",
                                        children: "FLEXIBLE PLANS FOR EVERY BUSINESS"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 17,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "section-heading",
                                        children: "Simple, Transparent Pricing"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 18,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "section-subheading",
                                        children: "Choose a plan that fits your needs. Upgrade as you grow."
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 19,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                lineNumber: 16,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b8d3dbacf1a75d0c" + " " + "billing-pill-toggle",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setBillingCycle('monthly'),
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + `billing-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`,
                                        children: "Monthly"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 26,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setBillingCycle('yearly'),
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + `billing-toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`,
                                        children: [
                                            "Yearly",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "discount-tag",
                                                children: "Save 20%"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 37,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 32,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b8d3dbacf1a75d0c" + " " + "pricing-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b8d3dbacf1a75d0c" + " " + "pricing-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "card-top",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-name",
                                                children: "Starter"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 47,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-subtitle",
                                                children: "For small fleets and startups"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 48,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-price-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-price",
                                                        children: billingCycle === 'monthly' ? '₹4,999' : '₹3,999'
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 50,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-cycle",
                                                        children: "/month"
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 53,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 49,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 46,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-features-list",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 59,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 59,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Up to 50 vehicles"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 58,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 63,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 63,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Basic features"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 62,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 67,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 67,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Email support"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 66,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 57,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRequestDemo('Starter Plan'),
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-btn-outline",
                                        children: "Get Started"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b8d3dbacf1a75d0c" + " " + "pricing-card popular-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "popular-badge",
                                        children: "Most Popular"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "card-top",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-name",
                                                children: "Growth"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 85,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-subtitle",
                                                children: "For growing businesses"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 86,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-price-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-price",
                                                        children: billingCycle === 'monthly' ? '₹9,999' : '₹7,999'
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 88,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-cycle",
                                                        children: "/month"
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 91,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 87,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-features-list",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 97,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Up to 200 vehicles"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 101,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Advanced features"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 100,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 105,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 105,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Multi-zone support"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 104,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 109,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Priority support"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 108,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRequestDemo('Growth Plan'),
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-btn-primary",
                                        children: "Start Free Trial"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 114,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b8d3dbacf1a75d0c" + " " + "pricing-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "card-top",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-name",
                                                children: "Business"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 125,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-subtitle",
                                                children: "For established operators"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 126,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-price-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-price",
                                                        children: billingCycle === 'monthly' ? '₹19,999' : '₹15,999'
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 128,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-cycle",
                                                        children: "/month"
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 131,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 127,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-features-list",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 137,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Up to 500 vehicles"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 136,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 141,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 17
                                                    }, this),
                                                    "All premium features"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 140,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 145,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Custom reports"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 144,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 149,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 149,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Dedicated support"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 148,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRequestDemo('Business Plan'),
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-btn-outline",
                                        children: "Contact Sales"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b8d3dbacf1a75d0c" + " " + "pricing-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "card-top",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-name",
                                                children: "Enterprise"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 165,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-subtitle",
                                                children: "For large fleets & franchises"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 166,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-price-wrap",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '26px'
                                                    },
                                                    className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-price",
                                                    children: "Custom Pricing"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 167,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-features-list",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 176,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Unlimited vehicles"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 175,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 17
                                                    }, this),
                                                    "White-label solution"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 179,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 184,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 17
                                                    }, this),
                                                    "API access"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 183,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-b8d3dbacf1a75d0c",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#16A34A",
                                                        strokeWidth: "2.5",
                                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "check-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "20 6 9 17 4 12",
                                                            className: "jsx-b8d3dbacf1a75d0c"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                            lineNumber: 188,
                                                            columnNumber: 135
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Dedicated account manager"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                                lineNumber: 187,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 174,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRequestDemo('Enterprise Plan'),
                                        className: "jsx-b8d3dbacf1a75d0c" + " " + "plan-btn-outline",
                                        children: "Talk to Us"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                        lineNumber: 193,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/Pricing.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/components/Pricing.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "b8d3dbacf1a75d0c",
                children: ".billing-pill-toggle.jsx-b8d3dbacf1a75d0c{background:#f1f5f9;border:1px solid #e2e8f0;border-radius:9999px;align-items:center;padding:4px;display:flex}.billing-toggle-btn.jsx-b8d3dbacf1a75d0c{color:#475569;cursor:pointer;background:0 0;border:none;border-radius:9999px;align-items:center;gap:6px;padding:8px 18px;font-size:13px;font-weight:700;transition:all .2s;display:flex}.billing-toggle-btn.active.jsx-b8d3dbacf1a75d0c{color:#fff;background:#2a195c;box-shadow:0 2px 8px #2a195c40}.discount-tag.jsx-b8d3dbacf1a75d0c{color:#fff;background:#22c55e;border-radius:9999px;padding:2px 7px;font-size:10.5px;font-weight:800}.pricing-grid.jsx-b8d3dbacf1a75d0c{grid-template-columns:repeat(4,1fr);align-items:stretch;gap:20px;display:grid}.pricing-card.jsx-b8d3dbacf1a75d0c{background:#fff;border:1px solid #e2e8f0;border-radius:18px;flex-direction:column;padding:28px 24px;transition:transform .2s,box-shadow .2s;display:flex;position:relative}.pricing-card.jsx-b8d3dbacf1a75d0c:hover{transform:translateY(-4px);box-shadow:0 12px 30px #0f172a14}.popular-card.jsx-b8d3dbacf1a75d0c{border-color:#2a195c;box-shadow:0 8px 24px #2a195c1f}.popular-badge.jsx-b8d3dbacf1a75d0c{color:#fff;background:#22c55e;border-radius:9999px;padding:3px 10px;font-size:11px;font-weight:800;position:absolute;top:-12px;right:20px;box-shadow:0 2px 6px #22c55e59}.card-top.jsx-b8d3dbacf1a75d0c{border-bottom:1px solid #f1f5f9;margin-bottom:24px;padding-bottom:20px}.plan-name.jsx-b8d3dbacf1a75d0c{color:#0f172a;margin-bottom:4px;font-family:Outfit,sans-serif;font-size:20px;font-weight:800}.plan-subtitle.jsx-b8d3dbacf1a75d0c{color:#64748b;margin-bottom:16px;font-size:12.5px}.plan-price-wrap.jsx-b8d3dbacf1a75d0c{align-items:baseline;gap:4px;display:flex}.plan-price.jsx-b8d3dbacf1a75d0c{color:#0f172a;letter-spacing:-.02em;font-family:Outfit,sans-serif;font-size:32px;font-weight:900}.plan-cycle.jsx-b8d3dbacf1a75d0c{color:#64748b;font-size:13px;font-weight:600}.plan-features-list.jsx-b8d3dbacf1a75d0c{flex-direction:column;flex:1;gap:12px;margin-bottom:28px;list-style:none;display:flex}.plan-features-list.jsx-b8d3dbacf1a75d0c li.jsx-b8d3dbacf1a75d0c{color:#334155;align-items:center;gap:9px;font-size:13px;font-weight:500;display:flex}.check-icon.jsx-b8d3dbacf1a75d0c{flex-shrink:0}.plan-btn-outline.jsx-b8d3dbacf1a75d0c{color:#1e293b;cursor:pointer;background:#fff;border:1.5px solid #cbd5e1;border-radius:9999px;width:100%;padding:11px;font-size:13.5px;font-weight:700;transition:all .15s}.plan-btn-outline.jsx-b8d3dbacf1a75d0c:hover{color:#2a195c;background:#f8fafc;border-color:#2a195c}.plan-btn-primary.jsx-b8d3dbacf1a75d0c{color:#fff;cursor:pointer;background:#2a195c;border:none;border-radius:9999px;width:100%;padding:11px;font-size:13.5px;font-weight:700;transition:all .15s;box-shadow:0 4px 12px #2a195c4d}.plan-btn-primary.jsx-b8d3dbacf1a75d0c:hover{background:#3b2382;transform:translateY(-1px)}@media (width<=1024px){.pricing-grid.jsx-b8d3dbacf1a75d0c{grid-template-columns:repeat(2,1fr)}}@media (width<=640px){.pricing-grid.jsx-b8d3dbacf1a75d0c{grid-template-columns:1fr}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/saas-website/src/components/Pricing.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_s(Pricing, "81HlboJFv/B1zl60iH3lKb8zPsQ=");
_c = Pricing;
var _c;
__turbopack_context__.k.register(_c, "Pricing");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/SocialProof.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SocialProof
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
'use client';
;
;
const PARTNERS = [
    {
        name: 'ZYPP Electric',
        logo: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#16A34A',
                    letterSpacing: '-0.02em'
                },
                children: "⚡ZYPP"
            }, void 0, false, {
                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                lineNumber: 9,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/saas-website/src/components/SocialProof.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        name: 'Bounce',
        logo: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                fontSize: '22px',
                fontWeight: 900,
                color: '#E11D48',
                letterSpacing: '-0.03em'
            },
            children: "bounce"
        }, void 0, false, {
            fileName: "[project]/saas-website/src/components/SocialProof.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        name: 'Rapido',
        logo: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#FACC15',
                padding: '3px 8px',
                borderRadius: '6px'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: '15px',
                    fontWeight: 900,
                    color: '#000000',
                    letterSpacing: '0.04em'
                },
                children: "RAPIDO"
            }, void 0, false, {
                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/saas-website/src/components/SocialProof.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        name: 'Lectrix',
        logo: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#22C55E'
                    }
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#0F172A',
                        letterSpacing: '0.06em'
                    },
                    children: "LECTRIX"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/SocialProof.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        name: 'Altigreen',
        logo: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "#16A34A",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                        points: "12 2 22 20 2 20 12 2"
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                        lineNumber: 40,
                        columnNumber: 72
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: '16.5px',
                        fontWeight: 900,
                        color: '#16A34A',
                        letterSpacing: '0.02em'
                    },
                    children: "ALTIGREEN"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/SocialProof.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        name: 'BluSmart Mobility',
        logo: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 1
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: '19px',
                        fontWeight: 900,
                        color: '#0284C7',
                        letterSpacing: '-0.02em'
                    },
                    children: "BLU"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: '7.5px',
                        fontWeight: 800,
                        color: '#0284C7',
                        letterSpacing: '0.06em'
                    },
                    children: "SMART MOBILITY"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/SocialProof.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        name: 'Yulu',
        logo: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: '3.5px solid #06B6D4'
                    }
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: '20px',
                        fontWeight: 900,
                        color: '#06B6D4',
                        letterSpacing: '-0.02em'
                    },
                    children: "yulu"
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/SocialProof.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }
];
function SocialProof() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        style: {
            padding: '65px 0 50px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            borderBottom: '1px solid #E2E8F0'
        },
        className: "jsx-76aa75ed7e753713",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-76aa75ed7e753713" + " " + "container-custom",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-76aa75ed7e753713" + " " + "metrics-header-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-76aa75ed7e753713",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-76aa75ed7e753713" + " " + "section-tag",
                                        children: "TRUSTED PLATFORM"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            fontSize: '28px',
                                            marginBottom: '6px'
                                        },
                                        className: "jsx-76aa75ed7e753713" + " " + "section-heading",
                                        children: "Powering EV Businesses Across India"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                        lineNumber: 73,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '14px'
                                        },
                                        className: "jsx-76aa75ed7e753713" + " " + "section-subheading",
                                        children: "Join leading companies who trust Evegah for their EV operations."
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-76aa75ed7e753713" + " " + "stats-counters-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-76aa75ed7e753713" + " " + "stat-counter-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-76aa75ed7e753713" + " " + "stat-num",
                                                children: "500+"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                                lineNumber: 84,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-76aa75ed7e753713" + " " + "stat-label",
                                                children: "Active Fleets"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                                lineNumber: 85,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                        lineNumber: 83,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-76aa75ed7e753713" + " " + "stat-counter-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-76aa75ed7e753713" + " " + "stat-num",
                                                children: "50,000+"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                                lineNumber: 88,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-76aa75ed7e753713" + " " + "stat-label",
                                                children: "Riders Managed"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                                lineNumber: 89,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-76aa75ed7e753713" + " " + "stat-counter-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-76aa75ed7e753713" + " " + "stat-num",
                                                children: "1M+"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                                lineNumber: 92,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-76aa75ed7e753713" + " " + "stat-label",
                                                children: "Battery Swaps"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                                lineNumber: 93,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-76aa75ed7e753713" + " " + "stat-counter-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-76aa75ed7e753713" + " " + "stat-num",
                                                children: "99.9%"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-76aa75ed7e753713" + " " + "stat-label",
                                                children: "Uptime"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                                lineNumber: 97,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-76aa75ed7e753713" + " " + "partners-strip",
                        children: PARTNERS.map((partner)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-76aa75ed7e753713" + " " + "partner-logo-box",
                                children: partner.logo
                            }, partner.name, false, {
                                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/components/SocialProof.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "76aa75ed7e753713",
                children: ".metrics-header-grid.jsx-76aa75ed7e753713{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:30px;margin-bottom:40px;display:flex}.stats-counters-row.jsx-76aa75ed7e753713{align-items:center;gap:36px;display:flex}.stat-counter-item.jsx-76aa75ed7e753713{text-align:left}.stat-num.jsx-76aa75ed7e753713{color:#0f172a;font-family:Outfit,sans-serif;font-size:28px;font-weight:800;line-height:1.1}.stat-label.jsx-76aa75ed7e753713{color:#64748b;margin-top:2px;font-size:11.5px;font-weight:600}.partners-strip.jsx-76aa75ed7e753713{border-top:1px solid #e2e8f0;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:24px;padding-top:24px;display:flex}.partner-logo-box.jsx-76aa75ed7e753713{opacity:.88;justify-content:center;align-items:center;padding:8px 12px;transition:opacity .2s,transform .2s;display:flex}.partner-logo-box.jsx-76aa75ed7e753713:hover{opacity:1;transform:translateY(-2px)}@media (width<=900px){.stats-counters-row.jsx-76aa75ed7e753713{grid-template-columns:repeat(2,1fr);gap:20px;width:100%;display:grid}.partners-strip.jsx-76aa75ed7e753713{justify-content:center;gap:20px}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/saas-website/src/components/SocialProof.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_c = SocialProof;
var _c;
__turbopack_context__.k.register(_c, "SocialProof");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/ContactCTA.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactCTA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
'use client';
;
;
function ContactCTA({ onRequestDemo }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "contact",
        style: {
            padding: '70px 0',
            backgroundColor: '#FFFFFF'
        },
        className: "jsx-a38186bed9f1a06",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-a38186bed9f1a06" + " " + "container-custom",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-a38186bed9f1a06" + " " + "contact-card-dual",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a38186bed9f1a06" + " " + "contact-left-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "jsx-a38186bed9f1a06" + " " + "contact-heading",
                                    children: "Let's Build a Cleaner Tomorrow"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                    lineNumber: 15,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-a38186bed9f1a06" + " " + "contact-subtext",
                                    children: "Get in touch with our team to learn how Evegah can power your EV fleet operations."
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                    lineNumber: 18,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onRequestDemo,
                                    className: "jsx-a38186bed9f1a06" + " " + "contact-btn-white",
                                    children: [
                                        "Contact Us",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "15",
                                            height: "15",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2.5",
                                            className: "jsx-a38186bed9f1a06",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "5",
                                                    y1: "12",
                                                    x2: "19",
                                                    y2: "12",
                                                    className: "jsx-a38186bed9f1a06"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                    lineNumber: 27,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                    points: "12 5 19 12 12 19",
                                                    className: "jsx-a38186bed9f1a06"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                    lineNumber: 28,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                            lineNumber: 26,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                    lineNumber: 21,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                            lineNumber: 14,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a38186bed9f1a06" + " " + "contact-right-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-a38186bed9f1a06" + " " + "contact-channels-wrap",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a38186bed9f1a06" + " " + "contact-channel-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a38186bed9f1a06" + " " + "channel-icon-wrap",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "18",
                                                        height: "18",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#2A195C",
                                                        strokeWidth: "2",
                                                        className: "jsx-a38186bed9f1a06",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                x: "2",
                                                                y: "4",
                                                                width: "20",
                                                                height: "16",
                                                                rx: "2",
                                                                className: "jsx-a38186bed9f1a06"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                                lineNumber: 40,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
                                                                className: "jsx-a38186bed9f1a06"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                                lineNumber: 41,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                        lineNumber: 39,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                    lineNumber: 38,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a38186bed9f1a06",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a38186bed9f1a06" + " " + "channel-label",
                                                            children: "Email Us"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                            lineNumber: 45,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "mailto:sales@evegah.com",
                                                            className: "jsx-a38186bed9f1a06" + " " + "channel-value",
                                                            children: "info@evegah.com"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                            lineNumber: 46,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                    lineNumber: 44,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                            lineNumber: 37,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a38186bed9f1a06" + " " + "contact-channel-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a38186bed9f1a06" + " " + "channel-icon-wrap",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "18",
                                                        height: "18",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#2A195C",
                                                        strokeWidth: "2",
                                                        className: "jsx-a38186bed9f1a06",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
                                                            className: "jsx-a38186bed9f1a06"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                            lineNumber: 53,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                        lineNumber: 52,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                    lineNumber: 51,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a38186bed9f1a06",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a38186bed9f1a06" + " " + "channel-label",
                                                            children: "Call Us"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                            lineNumber: 57,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "tel:+919876543210",
                                                            className: "jsx-a38186bed9f1a06" + " " + "channel-value",
                                                            children: "+91 89809 66677 "
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                            lineNumber: 58,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                    lineNumber: 56,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a38186bed9f1a06" + " " + "contact-channel-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a38186bed9f1a06" + " " + "channel-icon-wrap",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "18",
                                                        height: "18",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "#2A195C",
                                                        strokeWidth: "2",
                                                        className: "jsx-a38186bed9f1a06",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
                                                                className: "jsx-a38186bed9f1a06"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                                lineNumber: 65,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                cx: "12",
                                                                cy: "10",
                                                                r: "3",
                                                                className: "jsx-a38186bed9f1a06"
                                                            }, void 0, false, {
                                                                fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                                lineNumber: 66,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                        lineNumber: 64,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                    lineNumber: 63,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a38186bed9f1a06",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a38186bed9f1a06" + " " + "channel-label",
                                                            children: "Our Office"
                                                        }, void 0, false, {
                                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                            lineNumber: 70,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                textDecoration: 'none'
                                                            },
                                                            className: "jsx-a38186bed9f1a06" + " " + "channel-value",
                                                            children: [
                                                                "Office-10 Royal Nandish,Gotri",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                    className: "jsx-a38186bed9f1a06"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                                    lineNumber: 72,
                                                                    columnNumber: 50
                                                                }, this),
                                                                "Vadodara, Gujarat, India"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                            lineNumber: 71,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                                    lineNumber: 69,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                            lineNumber: 62,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-a38186bed9f1a06" + " " + "ev-scene-box",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/assets/scooter_charger_scene.png",
                                        alt: "Evegah Smart EV Scooter & Charging Station",
                                        className: "jsx-a38186bed9f1a06" + " " + "ev-scene-img"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                    lineNumber: 12,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "a38186bed9f1a06",
                children: ".contact-card-dual.jsx-a38186bed9f1a06{border:1px solid #e2e8f0;border-radius:20px;grid-template-columns:1.15fr 1.85fr;display:grid;overflow:hidden;box-shadow:0 16px 36px #0f172a14}.contact-left-col.jsx-a38186bed9f1a06{color:#fff;background:linear-gradient(145deg,#1e1548 0%,#2a195c 100%);flex-direction:column;justify-content:center;padding:44px 38px;display:flex}.contact-heading.jsx-a38186bed9f1a06{color:#fff;margin-bottom:12px;font-family:Outfit,sans-serif;font-size:28px;font-weight:800;line-height:1.2}.contact-subtext.jsx-a38186bed9f1a06{color:#cbd5e1;margin-bottom:26px;font-size:14px;line-height:1.55}.contact-btn-white.jsx-a38186bed9f1a06{color:#1e1548;cursor:pointer;background:#fff;border:none;border-radius:9999px;align-items:center;gap:8px;width:fit-content;padding:12px 24px;font-size:13.5px;font-weight:800;transition:all .2s;display:inline-flex;box-shadow:0 4px 12px #00000026}.contact-btn-white.jsx-a38186bed9f1a06:hover{background:#f8fafc;transform:translateY(-1px)}.contact-right-col.jsx-a38186bed9f1a06{background:#fff;justify-content:space-between;align-items:center;gap:24px;padding:36px 40px;display:flex;position:relative}.contact-channels-wrap.jsx-a38186bed9f1a06{z-index:5;flex-direction:column;gap:20px;display:flex}.contact-channel-item.jsx-a38186bed9f1a06{align-items:flex-start;gap:12px;display:flex}.channel-icon-wrap.jsx-a38186bed9f1a06{background:#f3e8ff;border-radius:10px;flex-shrink:0;justify-content:center;align-items:center;width:36px;height:36px;display:flex}.channel-label.jsx-a38186bed9f1a06{color:#64748b;text-transform:uppercase;letter-spacing:.03em;font-size:11px;font-weight:700}.channel-value.jsx-a38186bed9f1a06{color:#0f172a;font-size:13.5px;font-weight:700;line-height:1.3;text-decoration:none}.channel-value.jsx-a38186bed9f1a06:hover{color:#2a195c}.ev-scene-box.jsx-a38186bed9f1a06{justify-content:center;align-items:center;max-width:220px;display:flex}.ev-scene-img.jsx-a38186bed9f1a06{object-fit:contain;filter:drop-shadow(0 10px 20px #00000014);width:100%;height:auto}@media (width<=900px){.contact-card-dual.jsx-a38186bed9f1a06{grid-template-columns:1fr}.contact-right-col.jsx-a38186bed9f1a06{flex-direction:column;align-items:flex-start;padding:30px 24px}.ev-scene-box.jsx-a38186bed9f1a06{align-self:center;max-width:200px}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/saas-website/src/components/ContactCTA.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = ContactCTA;
var _c;
__turbopack_context__.k.register(_c, "ContactCTA");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
'use client';
;
;
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        style: {
            backgroundColor: '#0F172A',
            color: '#94A3B8',
            paddingTop: '50px',
            paddingBottom: '36px'
        },
        className: "jsx-15cc912335c3761e",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-15cc912335c3761e" + " " + "container-custom",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-15cc912335c3761e" + " " + "footer-top-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-15cc912335c3761e" + " " + "footer-brand-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '8px'
                                    },
                                    className: "jsx-15cc912335c3761e",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/assets/evegah_logo_clean.png",
                                        alt: "Evegah",
                                        style: {
                                            height: '34px',
                                            filter: 'brightness(0) invert(1)'
                                        },
                                        className: "jsx-15cc912335c3761e"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/Footer.tsx",
                                        lineNumber: 12,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 11,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '13px',
                                        color: '#64748B',
                                        margin: 0,
                                        fontWeight: 500
                                    },
                                    className: "jsx-15cc912335c3761e",
                                    children: "Cleaner Cities. Brighter Tomorrow."
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 18,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/Footer.tsx",
                            lineNumber: 10,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-15cc912335c3761e" + " " + "footer-links-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#features",
                                    className: "jsx-15cc912335c3761e" + " " + "footer-link",
                                    children: "Product"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#pricing",
                                    className: "jsx-15cc912335c3761e" + " " + "footer-link",
                                    children: "Pricing"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#about",
                                    className: "jsx-15cc912335c3761e" + " " + "footer-link",
                                    children: "About Us"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#contact",
                                    className: "jsx-15cc912335c3761e" + " " + "footer-link",
                                    children: "Contact"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/Footer.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-15cc912335c3761e" + " " + "footer-links-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#privacy",
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        alert('Evegah Technologies Privacy Policy');
                                    },
                                    className: "jsx-15cc912335c3761e" + " " + "footer-link",
                                    children: "Privacy Policy"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#terms",
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        alert('Evegah Technologies Terms of Service');
                                    },
                                    className: "jsx-15cc912335c3761e" + " " + "footer-link",
                                    children: "Terms of Service"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#sitemap",
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        alert('Evegah Sitemap');
                                    },
                                    className: "jsx-15cc912335c3761e" + " " + "footer-link",
                                    children: "Sitemap"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 35,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#careers",
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        alert('Evegah Careers: Reach out to careers@evegah.com');
                                    },
                                    className: "jsx-15cc912335c3761e" + " " + "footer-link",
                                    children: "Careers"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/Footer.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-15cc912335c3761e" + " " + "footer-right-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-15cc912335c3761e" + " " + "social-icons-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://linkedin.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            "aria-label": "LinkedIn",
                                            className: "jsx-15cc912335c3761e" + " " + "social-icon-btn",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "15",
                                                height: "15",
                                                viewBox: "0 0 24 24",
                                                fill: "currentColor",
                                                className: "jsx-15cc912335c3761e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
                                                    className: "jsx-15cc912335c3761e"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                                    lineNumber: 45,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Footer.tsx",
                                                lineNumber: 44,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/Footer.tsx",
                                            lineNumber: 43,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://twitter.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            "aria-label": "Twitter",
                                            className: "jsx-15cc912335c3761e" + " " + "social-icon-btn",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "15",
                                                height: "15",
                                                viewBox: "0 0 24 24",
                                                fill: "currentColor",
                                                className: "jsx-15cc912335c3761e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                                                    className: "jsx-15cc912335c3761e"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                                    lineNumber: 52,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Footer.tsx",
                                                lineNumber: 51,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/Footer.tsx",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://youtube.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            "aria-label": "YouTube",
                                            className: "jsx-15cc912335c3761e" + " " + "social-icon-btn",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "15",
                                                height: "15",
                                                viewBox: "0 0 24 24",
                                                fill: "currentColor",
                                                className: "jsx-15cc912335c3761e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
                                                    className: "jsx-15cc912335c3761e"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                                    lineNumber: 59,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Footer.tsx",
                                                lineNumber: 58,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/Footer.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://instagram.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            "aria-label": "Instagram",
                                            className: "jsx-15cc912335c3761e" + " " + "social-icon-btn",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "15",
                                                height: "15",
                                                viewBox: "0 0 24 24",
                                                fill: "currentColor",
                                                className: "jsx-15cc912335c3761e",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                                                    className: "jsx-15cc912335c3761e"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                                    lineNumber: 66,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/Footer.tsx",
                                                lineNumber: 65,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/Footer.tsx",
                                            lineNumber: 64,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '12px',
                                        color: '#64748B',
                                        marginTop: '12px'
                                    },
                                    className: "jsx-15cc912335c3761e",
                                    children: "© 2026 Evegah Technologies Pvt. Ltd. All rights reserved."
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/Footer.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/Footer.tsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/saas-website/src/components/Footer.tsx",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "15cc912335c3761e",
                children: ".footer-top-grid.jsx-15cc912335c3761e{grid-template-columns:1.4fr 1fr 1fr 1.4fr;align-items:start;gap:32px;display:grid}.footer-brand-col.jsx-15cc912335c3761e{flex-direction:column;display:flex}.footer-links-col.jsx-15cc912335c3761e{flex-direction:column;gap:10px;display:flex}.footer-link.jsx-15cc912335c3761e{color:#94a3b8;width:fit-content;font-size:13px;text-decoration:none;transition:color .15s}.footer-link.jsx-15cc912335c3761e:hover{color:#fff}.footer-right-col.jsx-15cc912335c3761e{flex-direction:column;align-items:flex-end;display:flex}.social-icons-row.jsx-15cc912335c3761e{align-items:center;gap:12px;display:flex}.social-icon-btn.jsx-15cc912335c3761e{color:#94a3b8;background:#1e293b;border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;text-decoration:none;transition:all .15s;display:flex}.social-icon-btn.jsx-15cc912335c3761e:hover{color:#fff;background:#2a195c;transform:translateY(-2px)}@media (width<=900px){.footer-top-grid.jsx-15cc912335c3761e{grid-template-columns:1fr 1fr;gap:24px}.footer-right-col.jsx-15cc912335c3761e{grid-column:span 2;align-items:flex-start}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/saas-website/src/components/Footer.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/DemoModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DemoModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function DemoModal({ isOpen, onClose, initialPlan }) {
    _s();
    const [fullName, setFullName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [workEmail, setWorkEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [orgName, setOrgName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [fleetSize, setFleetSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('51-200 vehicles');
    const [submitted, setSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (!isOpen) return null;
    const handleSubmit = (e)=>{
        e.preventDefault();
        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
            setSubmitted(true);
        }, 800);
    };
    const handleReset = ()=>{
        setSubmitted(false);
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        },
        onClick: handleReset,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                maxWidth: '480px',
                width: '100%',
                padding: '32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                position: 'relative'
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleReset,
                    style: {
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94A3B8',
                        padding: '4px'
                    },
                    "aria-label": "Close modal",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "18",
                                y1: "6",
                                x2: "6",
                                y2: "18"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                lineNumber: 77,
                                columnNumber: 111
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "6",
                                y1: "6",
                                x2: "18",
                                y2: "18"
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                lineNumber: 77,
                                columnNumber: 148
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this),
                submitted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        padding: '24px 8px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: '#DCFCE7',
                                color: '#16A34A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "32",
                                height: "32",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                    points: "20 6 9 17 4 12"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 95,
                                    columnNumber: 113
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                lineNumber: 95,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                fontFamily: 'Outfit, sans-serif',
                                fontSize: '22px',
                                fontWeight: 800,
                                color: '#0F172A',
                                marginBottom: '8px'
                            },
                            children: "Demo Request Received!"
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '14px',
                                color: '#64748B',
                                lineHeight: '1.5',
                                marginBottom: '24px'
                            },
                            children: [
                                "Thank you, ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: fullName || 'Fleet Manager'
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 101,
                                    columnNumber: 26
                                }, this),
                                ". Our EV solutions specialist will contact you at ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: workEmail
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 101,
                                    columnNumber: 122
                                }, this),
                                " within 2 business hours."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                            lineNumber: 100,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleReset,
                            className: "btn-primary",
                            style: {
                                width: '100%'
                            },
                            children: "Done"
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                    lineNumber: 81,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '20px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "section-tag",
                                    style: {
                                        marginBottom: '4px'
                                    },
                                    children: "GET IN TOUCH"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        fontFamily: 'Outfit, sans-serif',
                                        fontSize: '22px',
                                        fontWeight: 800,
                                        color: '#0F172A',
                                        margin: '0 0 4px'
                                    },
                                    children: "Request a Personalized Demo"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 111,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '13px',
                                        color: '#64748B',
                                        margin: 0
                                    },
                                    children: "See how Evegah powers your EV fleet, battery swaps, and rider app in one integrated platform."
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, this),
                                initialPlan && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: '8px',
                                        display: 'inline-block',
                                        backgroundColor: '#F3E8FF',
                                        color: '#2A195C',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        padding: '3px 10px',
                                        borderRadius: '6px'
                                    },
                                    children: [
                                        "Interested in: ",
                                        initialPlan
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 118,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                            lineNumber: 109,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                color: '#334155',
                                                marginBottom: '4px'
                                            },
                                            children: "Full Name *"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                            lineNumber: 126,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            required: true,
                                            placeholder: "e.g. Rahul Sharma",
                                            value: fullName,
                                            onChange: (e)=>setFullName(e.target.value),
                                            style: {
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: '8px',
                                                border: '1px solid #CBD5E1',
                                                fontSize: '13.5px',
                                                outline: 'none'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                            lineNumber: 127,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                color: '#334155',
                                                marginBottom: '4px'
                                            },
                                            children: "Work Email *"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "email",
                                            required: true,
                                            placeholder: "e.g. rahul@evmobility.com",
                                            value: workEmail,
                                            onChange: (e)=>setWorkEmail(e.target.value),
                                            style: {
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: '8px',
                                                border: '1px solid #CBD5E1',
                                                fontSize: '13.5px',
                                                outline: 'none'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                            lineNumber: 146,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 144,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '10px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: 'block',
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        color: '#334155',
                                                        marginBottom: '4px'
                                                    },
                                                    children: "Phone Number *"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "tel",
                                                    required: true,
                                                    placeholder: "+91 98765 43210",
                                                    value: phone,
                                                    onChange: (e)=>setPhone(e.target.value),
                                                    style: {
                                                        width: '100%',
                                                        padding: '10px 14px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #CBD5E1',
                                                        fontSize: '13.5px',
                                                        outline: 'none'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: 'block',
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        color: '#334155',
                                                        marginBottom: '4px'
                                                    },
                                                    children: "Organization"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "e.g. GreenMobility Pvt",
                                                    value: orgName,
                                                    onChange: (e)=>setOrgName(e.target.value),
                                                    style: {
                                                        width: '100%',
                                                        padding: '10px 14px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #CBD5E1',
                                                        fontSize: '13.5px',
                                                        outline: 'none'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                            lineNumber: 183,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                color: '#334155',
                                                marginBottom: '4px'
                                            },
                                            children: "Fleet Size"
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: fleetSize,
                                            onChange: (e)=>setFleetSize(e.target.value),
                                            style: {
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: '8px',
                                                border: '1px solid #CBD5E1',
                                                fontSize: '13.5px',
                                                outline: 'none',
                                                backgroundColor: '#FFFFFF'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "1-50 vehicles",
                                                    children: "1 - 50 EV Scooters / Bikes"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "51-200 vehicles",
                                                    children: "51 - 200 EV Vehicles"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "201-500 vehicles",
                                                    children: "201 - 500 EV Vehicles"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "500+ vehicles",
                                                    children: "500+ Enterprise Fleet"
                                                }, void 0, false, {
                                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                                    lineNumber: 220,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                            lineNumber: 204,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 202,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "btn-primary",
                                    disabled: loading,
                                    style: {
                                        width: '100%',
                                        marginTop: '6px',
                                        borderRadius: '10px',
                                        padding: '12px'
                                    },
                                    children: loading ? 'Submitting Request...' : 'Schedule Personalized Demo'
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/DemoModal.tsx",
                    lineNumber: 108,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/DemoModal.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/saas-website/src/components/DemoModal.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(DemoModal, "j2Lr0dnT8DqprJHodN1Ff4KEY7M=");
_c = DemoModal;
var _c;
__turbopack_context__.k.register(_c, "DemoModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/components/VideoModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VideoModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function VideoModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                backgroundColor: '#0F172A',
                borderRadius: '20px',
                maxWidth: '780px',
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                border: '1px solid #334155'
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '16px 20px',
                        backgroundColor: '#1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #334155'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: '#EF4444'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: '#F59E0B'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: '#10B981'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        color: '#F1F5F9',
                                        marginLeft: '8px'
                                    },
                                    children: "Evegah EV Fleet OS Platform Walkthrough (2026 Edition)"
                                }, void 0, false, {
                                    fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            style: {
                                background: 'none',
                                border: 'none',
                                color: '#94A3B8',
                                cursor: 'pointer',
                                padding: '4px'
                            },
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '24px',
                        textAlign: 'center',
                        color: '#FFFFFF'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            aspectRatio: '16 / 9',
                            borderRadius: '12px',
                            backgroundColor: '#1E1548',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/assets/evegah_hero_scene_hd.png",
                                alt: "Fleet Overview",
                                style: {
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    opacity: 0.35
                                }
                            }, void 0, false, {
                                fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'relative',
                                    zIndex: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '14px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '68px',
                                            height: '68px',
                                            borderRadius: '50%',
                                            backgroundColor: '#22C55E',
                                            color: '#0F172A',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 0 0 10px rgba(34, 197, 94, 0.25)',
                                            cursor: 'pointer'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "26",
                                            height: "26",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                points: "5 3 19 12 5 21 5 3"
                                            }, void 0, false, {
                                                fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                                lineNumber: 115,
                                                columnNumber: 85
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                            lineNumber: 115,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontFamily: 'Outfit, sans-serif',
                                            fontSize: '20px',
                                            fontWeight: 800
                                        },
                                        children: "End-to-End EV Fleet & Battery Telematics"
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '13px',
                                            color: '#CBD5E1',
                                            maxWidth: '420px'
                                        },
                                        children: "Live GPS geofencing, automated battery swap lockers, instant rider onboarding, and ICICI automated payouts."
                                    }, void 0, false, {
                                        fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/saas-website/src/components/VideoModal.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/saas-website/src/components/VideoModal.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/saas-website/src/components/VideoModal.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = VideoModal;
var _c;
__turbopack_context__.k.register(_c, "VideoModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/saas-website/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SaaSWebsiteHome
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/Navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/Hero.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Features$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/Features.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$MobilityInYourHands$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/MobilityInYourHands.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$EnterpriseIntegrations$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/EnterpriseIntegrations.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$HowItWorks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/HowItWorks.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Pricing$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/Pricing.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$SocialProof$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/SocialProof.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$ContactCTA$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/ContactCTA.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/Footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$DemoModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/DemoModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$VideoModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/saas-website/src/components/VideoModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
function SaaSWebsiteHome() {
    _s();
    const [demoModalOpen, setDemoModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedPlan, setSelectedPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [videoModalOpen, setVideoModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleOpenDemo = (planName)=>{
        setSelectedPlan(planName);
        setDemoModalOpen(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onRequestDemo: ()=>handleOpenDemo()
            }, void 0, false, {
                fileName: "[project]/saas-website/src/app/page.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    flex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onRequestDemo: ()=>handleOpenDemo(),
                        onWatchVideo: ()=>setVideoModalOpen(true)
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/app/page.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Features$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onRequestDemo: ()=>handleOpenDemo()
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/app/page.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$MobilityInYourHands$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onRequestDemo: ()=>handleOpenDemo()
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/app/page.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$EnterpriseIntegrations$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onRequestDemo: ()=>handleOpenDemo()
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/app/page.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$HowItWorks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/saas-website/src/app/page.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Pricing$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onRequestDemo: handleOpenDemo
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/app/page.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$SocialProof$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/saas-website/src/app/page.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$ContactCTA$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onRequestDemo: ()=>handleOpenDemo()
                    }, void 0, false, {
                        fileName: "[project]/saas-website/src/app/page.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/saas-website/src/app/page.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/saas-website/src/app/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$DemoModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: demoModalOpen,
                onClose: ()=>setDemoModalOpen(false),
                initialPlan: selectedPlan
            }, void 0, false, {
                fileName: "[project]/saas-website/src/app/page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$saas$2d$website$2f$src$2f$components$2f$VideoModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: videoModalOpen,
                onClose: ()=>setVideoModalOpen(false)
            }, void 0, false, {
                fileName: "[project]/saas-website/src/app/page.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/saas-website/src/app/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(SaaSWebsiteHome, "6+w5h99EBDOlf7T3BL0ESztDUOs=");
_c = SaaSWebsiteHome;
var _c;
__turbopack_context__.k.register(_c, "SaaSWebsiteHome");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=saas-website_src_1v-95sv._.js.map