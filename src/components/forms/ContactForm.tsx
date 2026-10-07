import MessageForm from "./MessageForm";
import type { Subject } from "../../features/contact/message";
export default function ContactForm({ subject }: { subject: Subject }) {
  return <MessageForm key={subject} subject={subject} />;
}
