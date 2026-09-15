import { useState } from "react";
import { SectionBg } from "./SectionBg";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Send, Linkedin, Github, CheckCircle2 } from "lucide-react";

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;
const CALLMEBOT_PHONE     = import.meta.env.VITE_CALLMEBOT_PHONE     as string;
const CALLMEBOT_API_KEY   = import.meta.env.VITE_CALLMEBOT_API_KEY   as string;

async function sendWhatsApp(name: string, senderEmail: string, subject: string, message: string) {
  if (!CALLMEBOT_PHONE || !CALLMEBOT_API_KEY) return;
  const text = encodeURIComponent(
    `📬 Portfolio Contact\n👤 ${name}\n📧 ${senderEmail}\n📌 ${subject}\n💬 ${message}`
  );
  await fetch(`https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${text}&apikey=${CALLMEBOT_API_KEY}`);
}

const formSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters."),
  email:   z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});
type FormData = z.infer<typeof formSchema>;
type Props = { content?: any };

const ContactSection = ({ content }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const contactData = content?.contact;

  const location          = contactData?.location          ?? "";
  const email             = contactData?.email             ?? "";
  const phone             = contactData?.phone             ?? "";
  const linkedinUrl       = contactData?.linkedinUrl       ?? "#";
  const githubUrl         = contactData?.githubUrl         ?? "#";
  const availabilityTitle = contactData?.availabilityTitle ?? "Currently Available";
  const availabilityText  = contactData?.availabilityText  ?? "Remote · available during US Eastern and UK working hours · open to full-time (direct or via EOR) and contract roles";

  const contactItems = [
    { icon: MapPin, label: "Location", value: location,               href: undefined         },
    { icon: Mail,   label: "Email",    value: email,                   href: `mailto:${email}` },
  ];

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", href: linkedinUrl },
    { icon: Github,   label: "GitHub",   href: githubUrl   },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
        { from_name: data.name, from_email: data.email, subject: data.subject, message: data.message, to_name: "Siddharajsinh" },
        EMAILJS_PUBLIC_KEY
      );
      sendWhatsApp(data.name, data.email, data.subject, data.message).catch(() => {});
      toast({ title: "Message sent!", description: "I'll get back to you soon." });
      form.reset();
    } catch {
      toast({ title: "Failed to send", description: "Please email me directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "var(--section-bg)" }}
    >
      <SectionBg variant="contact" />
      <div className="absolute top-0 left-0 w-full h-px section-accent-line" />

      {/* Aurora backgrounds */}
      <div
        className="absolute -top-20 left-0 w-[600px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 68%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(37,99,235,0.2) 0%, transparent 68%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="font-mono text-sm mb-3" style={{ color: "#a78bfa" }}>// let&apos;s connect</p>
          <h2 className="section-heading gradient-text-animated inline-block">Get In Touch</h2>
          <p className="section-subheading mt-4">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Left — Contact info */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {/* Info cards */}
            <div className="glass-card rounded-2xl p-6 space-y-5">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}
                  >
                    <Icon className="w-4.5 h-4.5 text-white" style={{ width: "18px", height: "18px" }} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5 font-mono">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm font-medium text-foreground">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-sm font-semibold text-foreground mb-4">Connect with me</p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground flex-1 justify-center"
                    style={{
                      background: "rgba(124,58,237,0.07)",
                      border: "1px solid rgba(124,58,237,0.18)",
                    }}
                    whileHover={{
                      color: "#fff",
                      background: "rgba(124,58,237,0.15)",
                      borderColor: "rgba(167,139,250,0.4)",
                      y: -2,
                    }}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Available badge */}
            <motion.div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
              animate={{ borderColor: ["rgba(124,58,237,0.2)", "rgba(37,99,235,0.35)", "rgba(124,58,237,0.2)"] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-foreground">{availabilityTitle}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {availabilityText}
              </p>
            </motion.div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            className="lg:col-span-3 glass-card rounded-2xl p-7 md:p-8"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-muted-foreground">Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field}
                          className="rounded-xl border-white/10 focus:border-violet-500/50 transition-colors"
                          style={{ background: "rgba(255,255,255,0.04)" }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-muted-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field}
                          className="rounded-xl border-white/10 focus:border-violet-500/50 transition-colors"
                          style={{ background: "rgba(255,255,255,0.04)" }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-muted-foreground">Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Inquiry / Collaboration" {...field}
                        className="rounded-xl border-white/10 focus:border-violet-500/50 transition-colors"
                        style={{ background: "rgba(255,255,255,0.04)" }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-muted-foreground">Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell me about your project..." rows={5} {...field}
                        className="rounded-xl border-white/10 focus:border-violet-500/50 transition-colors resize-none"
                        style={{ background: "rgba(255,255,255,0.04)" }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white rounded-xl py-6 font-bold text-base relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 60%, #0891b2 100%)",
                      boxShadow: "0 6px 28px rgba(124,58,237,0.45)",
                      border: "none",
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" /> Send Message
                      </span>
                    )}
                  </Button>
                </motion.div>

                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Your message goes straight to my inbox &amp; WhatsApp
                </p>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
