import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Privacy | Apply Tracker" };

export default function PrivacyPage() {
	return (
		<LegalPage title="Privacy" updated="23 November 2026">
			<p>
				Apply Tracker is a personal project by Iakovos Tifas. It&apos;s built so
				that your job search stays yours: there are no accounts on the demo, no
				advertising and no tracking.
			</p>

			<h2>What the app stores</h2>
			<p>
				Everything you enter (companies, roles, contacts, notes, dates and
				follow-ups) is saved only on your device:
			</p>
			<ul>
				<li>
					In the web demo, it&apos;s kept in your browser&apos;s local storage.
					It never reaches a server. Clearing your browser data or choosing
					Reset sample data deletes it.
				</li>
				<li>
					In the desktop app, it&apos;s kept in the app&apos;s storage folder
					on your computer. Uninstalling the app and removing that folder
					deletes it.
				</li>
			</ul>
			<p>
				Because we never receive this data, we can&apos;t see it, share it or
				recover it for you. Use Export in Settings to keep a copy.
			</p>

			<h2>What the hosting provider sees</h2>
			<p>
				The web demo is served by Cloudflare. To deliver the pages and protect
				the site from abuse, Cloudflare processes technical request data such
				as your IP address, browser type and the pages requested, and keeps
				request logs for a limited time. The app doesn&apos;t set cookies of
				its own. See{" "}
				<a href="https://www.cloudflare.com/privacypolicy/">
					Cloudflare&apos;s privacy policy
				</a>{" "}
				for details.
			</p>

			<h2>Updates in the desktop app</h2>
			<p>
				When the desktop app starts, it checks GitHub for a newer version.
				That request goes to GitHub, which sees your IP address as part of
				normal web traffic. No information about your applications is sent.
			</p>

			<h2>Your rights under the GDPR</h2>
			<p>
				If you&apos;re in the European Economic Area or the UK, you have the
				right to access, correct, delete, restrict or object to the processing
				of your personal data, and to complain to your data protection
				authority. For the web demo, the only personal data processed is the
				request data described above, handled on the basis of legitimate
				interest in running a secure website. Your tracker data is under your
				control alone, and you can delete it at any time as described above.
			</p>
			<p>
				If you run your own copy of Apply Tracker on a server, you are the
				controller of the data it stores and are responsible for your own
				privacy notice.
			</p>

			<h2>Children</h2>
			<p>Apply Tracker is not directed at children under 16.</p>

			<h2>Contact</h2>
			<p>
				Questions or requests about privacy can be sent through the contact
				details on <a href="https://www.iakovostifas.com">iakovostifas.com</a>.
				Changes to this page will be shown here with a new date.
			</p>
		</LegalPage>
	);
}
