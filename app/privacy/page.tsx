import type { Metadata } from 'next'
import { LegalShell, Section, H3, P, UL, Strong, A } from '@/components/legal-shell'

export const metadata: Metadata = {
  title: 'privacy policy — friday',
  description:
    'How Friday handles your data. Privacy-first by design: your keys, conversations, and logs stay on your device.'
}

export default function PrivacyPage() {
  return (
    <LegalShell title="privacy policy" lastUpdated="June 30, 2026">
      <Section title="">
        <P>
          Friday (“Friday”, “we”, “us”, or “our”) is a voice-first AI assistant that runs as a
          desktop application on your computer. This Privacy Policy explains what information we
          collect, how it is used, and the choices you have. Friday is operated by Sagar Tamang
          (feynmanpi).
        </P>
      </Section>

      <Section title="The short version">
        <UL>
          <li>
            Friday is designed to be <Strong>privacy-first</Strong>. The vast majority of your data
            — your API keys, your conversations, and your activity logs — stays on your own device
            and is never sent to us.
          </li>
          <li>
            The only information we store on our servers is the basic profile from your Google
            sign-in (your name, email, and profile picture), so we know who our users are.
          </li>
          <li>
            When you talk to Friday, ask it to look at your screen, search the web, or control your
            computer, that content is sent <Strong>directly from your device to OpenAI</Strong>{' '}
            using your own OpenAI API key. We do not receive, see, or store it.
          </li>
        </UL>
      </Section>

      <Section title="1. Information we collect">
        <H3>a. Account information (stored on our servers)</H3>
        <P>When you sign in with Google, we receive and store:</P>
        <UL>
          <li>your name;</li>
          <li>your email address;</li>
          <li>your Google profile picture URL;</li>
          <li>your Google account identifier;</li>
          <li>the dates and times of your sign-ins.</li>
        </UL>
        <P>
          We use Google Sign-In and receive this profile information from Google. We do{' '}
          <Strong>not</Strong> receive or store your Google password, and we do not retain Google
          access or refresh tokens.
        </P>

        <H3>b. Information that stays on your device (we never receive it)</H3>
        <P>The following is stored only locally on your computer, in the app’s data folder:</P>
        <UL>
          <li>
            <Strong>API keys</Strong> — your OpenAI API key (and any other provider keys) are
            encrypted at rest using your operating system’s secure storage (Keychain on macOS,
            DPAPI/Credential storage on Windows, libsecret on Linux) before being saved.
          </li>
          <li>
            <Strong>Conversation history and logs</Strong> — transcripts of what you say and what
            Friday says, the tools Friday uses, your web-search queries and results, and diagnostic
            logs are written to a local log file on your machine.
          </li>
          <li>
            <Strong>Preferences</Strong> — your onboarding choices and settings.
          </li>
        </UL>
        <P>
          We have no access to any of this. It is not transmitted to our servers.
        </P>

        <H3>c. Information processed by AI providers (we never receive it)</H3>
        <P>
          To understand and respond to you, Friday sends certain data directly from your device to
          OpenAI, authenticated with your own OpenAI API key:
        </P>
        <UL>
          <li>
            <Strong>Voice &amp; audio</Strong> — your microphone audio is streamed to OpenAI’s
            Realtime API so Friday can hear and respond.
          </li>
          <li>
            <Strong>Screen captures</Strong> — when you ask Friday to look at your screen (or when it
            uses computer control), screenshots of your screen are sent to OpenAI’s vision models.
          </li>
          <li>
            <Strong>Web searches</Strong> — the text of your search requests is sent to OpenAI’s
            web-search tool.
          </li>
          <li>
            <Strong>Computer-control context</Strong> — when you ask Friday to operate your computer,
            screenshots and the actions to take are exchanged with OpenAI’s computer-use model; the
            resulting mouse and keyboard actions are then performed locally on your machine.
          </li>
        </UL>
        <P>
          This data flows directly between your device and OpenAI. We are not an intermediary for it
          — it does not pass through, and is not stored on, our servers. Because you use your own
          OpenAI API key, this processing is governed by OpenAI’s API terms and privacy policy.
          OpenAI states that data submitted through its API is not used to train its models by
          default.
        </P>
      </Section>

      <Section title="2. Third-party services">
        <P>Friday relies on the following third parties:</P>
        <UL>
          <li>
            <Strong>OpenAI</Strong> — powers voice conversation, screen understanding, web search,
            and computer control, using your own API key. See{' '}
            <A href="https://openai.com/policies/privacy-policy">OpenAI’s Privacy Policy</A>.
          </li>
          <li>
            <Strong>Google</Strong> — provides Sign-In (authentication). The app also requests
            website favicons from Google’s favicon service to display icons next to web-search
            results, which sends the relevant website domains to Google. See{' '}
            <A href="https://policies.google.com/privacy">Google’s Privacy Policy</A>.
          </li>
          <li>
            <Strong>Cloudflare</Strong> — hosts our website and stores the sign-in records described
            in section 1(a) (Cloudflare D1). See{' '}
            <A href="https://www.cloudflare.com/privacypolicy/">Cloudflare’s Privacy Policy</A>.
          </li>
          <li>
            <Strong>Vercel Analytics</Strong> — our website (friday.feynmanpi.com) uses
            privacy-friendly, aggregate analytics that do not use cookies to identify you.
          </li>
        </UL>
      </Section>

      <Section title="3. How we use information">
        <P>We use the limited account information we collect to:</P>
        <UL>
          <li>understand who our users are and how many people use Friday;</li>
          <li>
            communicate with you about the product, important updates, or support, where
            appropriate;
          </li>
          <li>maintain the security and integrity of the service.</li>
        </UL>
        <P>
          We do <Strong>not</Strong> sell your personal information, and we do not use it for
          advertising.
        </P>
      </Section>

      <Section title="4. Device permissions">
        <P>To function, the desktop app asks your operating system for:</P>
        <UL>
          <li>
            <Strong>Microphone access</Strong> — to hear your voice commands.
          </li>
          <li>
            <Strong>Screen recording / capture</Strong> — to let Friday see your screen when you ask
            it to.
          </li>
          <li>
            <Strong>Accessibility / automation control</Strong> — to let Friday move the mouse and
            type on your behalf when you ask it to control your computer.
          </li>
        </UL>
        <P>
          You can grant or revoke these permissions at any time in your operating system settings.
          Friday only uses them in response to your requests.
        </P>
      </Section>

      <Section title="5. Data security">
        <UL>
          <li>Your API keys are encrypted on your device using OS-level secure storage.</li>
          <li>
            Communication with OpenAI, Google, and our servers uses encrypted HTTPS/TLS connections.
          </li>
          <li>
            The sign-in records on our servers are limited to the basic profile fields listed above.
          </li>
        </UL>
        <P>
          No method of storage or transmission is 100% secure, but we take reasonable measures to
          protect your information.
        </P>
      </Section>

      <Section title="6. Your choices and rights">
        <UL>
          <li>
            <Strong>Revoke Google access</Strong> at any time at{' '}
            <A href="https://myaccount.google.com/permissions">
              myaccount.google.com/permissions
            </A>
            .
          </li>
          <li>
            <Strong>Delete local data</Strong> — your keys, logs, and history live on your device;
            you can clear them by resetting the app or uninstalling it.
          </li>
          <li>
            <Strong>Delete your account record</Strong> — to have the sign-in profile we store
            deleted, email us at <A href="mailto:build@sagartamang.com">build@sagartamang.com</A>.
          </li>
        </UL>
        <P>
          Depending on where you live, you may have additional rights under laws such as the GDPR or
          India’s DPDP Act, including the right to access, correct, or delete your personal data.
        </P>
      </Section>

      <Section title="7. Children">
        <P>
          Friday is not directed to children under 13 (or the minimum age required in your
          jurisdiction), and we do not knowingly collect their personal information.
        </P>
      </Section>

      <Section title="8. Changes to this policy">
        <P>
          We may update this Privacy Policy from time to time. We will revise the “Last updated” date
          above and, for material changes, take reasonable steps to notify you.
        </P>
      </Section>

      <Section title="9. Contact">
        <P>
          Questions about this policy or your data? Email us at{' '}
          <A href="mailto:build@sagartamang.com">build@sagartamang.com</A>.
        </P>
      </Section>
    </LegalShell>
  )
}
