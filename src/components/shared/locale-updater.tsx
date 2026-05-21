"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function LocaleUpdater() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language || "en";
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return null;
}
