import { COMPANY } from "@/lib/company";

export function ContactDetails({
  className = "",
}: {
  className?: string;
}) {
  return (
    <address className={`not-italic ${className}`}>
      <p className="font-semibold text-foreground">{COMPANY.legalName}</p>
      <p className="mt-3">
        <a className="hover:text-foreground" href={`mailto:${COMPANY.email}`}>
          {COMPANY.email}
        </a>
      </p>
      <ul className="mt-3 space-y-2">
        {COMPANY.phones.map((phone) => (
          <li key={phone.tel}>
            <span className="text-foreground/80">{phone.region}</span>
            {": "}
            <a className="hover:text-foreground" href={`tel:${phone.tel}`}>
              {phone.display}
            </a>
          </li>
        ))}
      </ul>
    </address>
  );
}
