import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Terms | Apply Tracker" };

export default function TermsPage() {
	return (
		<LegalPage title="Terms of use" updated="23 November 2026">
			<p>
				By using the Apply Tracker web demo or desktop app, you agree to these
				terms. If you don&apos;t agree, please don&apos;t use them.
			</p>

			<h2>What Apply Tracker is</h2>
			<p>
				Apply Tracker is a free, open-source personal project for keeping track
				of job applications. The web demo exists to show how the app works.
				Don&apos;t rely on it as the only place you keep important information,
				and export a copy of anything you want to keep.
			</p>

			<h2>Company names and sample data</h2>
			<p>
				The demo is filled with sample applications that mention well-known
				companies, including Microsoft, Google, Amazon, Meta, Stripe and Airbnb.
				These names are used only to make the example realistic. They are
				trademarks of their respective owners, and Apply Tracker is not
				affiliated with, endorsed by or sponsored by any of them.
			</p>
			<p>
				All roles, salaries, dates, interview stages, notes and contact people
				in the sample data are invented. Contact addresses use the reserved
				example.com domain and don&apos;t belong to real people.
			</p>

			<h2>Acceptable use</h2>
			<ul>
				<li>Use the app for lawful purposes.</li>
				<li>
					Only enter information about other people (such as recruiters) that
					you are allowed to keep, and keep it accurate.
				</li>
				<li>
					Don&apos;t try to disrupt the website, probe it for weaknesses
					without permission, or overload it with automated traffic.
					Security issues can be reported as described in the project&apos;s
					security policy.
				</li>
			</ul>

			<h2>Copyright and licence</h2>
			<p>
				Copyright © 2026 Iakovos Tifas. The source code is released under the{" "}
				<a href="https://github.com/itifas/apply-tracker-public/blob/main/LICENSE">
					MIT License
				</a>
				, which lets you use, copy, modify and distribute it, provided the
				copyright and licence notice are kept. The Overpass typeface is used
				under the SIL Open Font License, and other open-source components keep
				their own licences.
			</p>

			<h2>No warranty</h2>
			<p>
				Apply Tracker is provided &quot;as is&quot;, without warranty of any
				kind. To the extent permitted by law, the author is not liable for lost
				data or any other damage arising from its use. Nothing in these terms
				limits rights you have under consumer law that can&apos;t be waived.
			</p>

			<h2>Changes</h2>
			<p>
				These terms may change as the project develops. The date at the top
				shows the latest version. Questions can be sent through the contact
				details on <a href="https://www.iakovostifas.com">iakovostifas.com</a>.
			</p>
		</LegalPage>
	);
}
