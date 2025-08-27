import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "../styles/ContactPage.css"

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert("Thanks for reaching out! (Email integration coming soon 🚀)");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Get in Touch ✉️</h1>
      <p className="contact-subtitle">
        I’d love to connect! Whether it’s feedback, collaboration, or ideas, drop a message below.
      </p>

      {/* Social Links */}
      <div className="contact-socials">
        <a
          href="https://github.com/aslamsayyad02"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaGithub size={28} /> /aslams2020
        </a>
        <a
          href="https://www.linkedin.com/in/aslamsayyad02"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaLinkedin size={28} /> /in/aslamsayyad02/
        </a>
      </div>

      {/* Contact Form */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Purpose of Message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="btn">Send Message</button>
      </form>
    </div>
  );
}
