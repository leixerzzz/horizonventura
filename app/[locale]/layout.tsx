import React from "react";
import { notFound } from "next/navigation";
import { NextIntlProvider } from "next-intl";
import { locales } from "../../../lib/i18n";

type Props = {
	children: React.ReactNode;
	params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
	const locale = params.locale;
	if (!locales.includes(locale as any)) notFound();

	const messages = (await import(`../../../messages/${locale}.json`)).default;

	return (
		<html lang={locale}>
			<body>
				<NextIntlProvider locale={locale} messages={messages}>
					{children}
				</NextIntlProvider>
			</body>
		</html>
	);
}
