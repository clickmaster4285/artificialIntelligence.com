import { COMPANY } from "@/lib/company";

export function ContactDetails({
  className = "",
}: {
  className?: string;
}) {
  return (
    <address className={`not-italic ${className}`}>
      <p className="font-semibold text-foreground">{COMPANY.legalName}</p>
      <p className="mt-2">
        {COMPANY.address.locality}, {COMPANY.address.region}
      </p>
      <p>{COMPANY.address.countryName}</p>
      <p className="mt-3">
        <a
          className="hover:text-foreground"
          href={`mailto:${COMPANY.email}`}
        >
          {COMPANY.email}
        </a>
      </p>
      <p>
        <a className="hover:text-foreground" href={`tel:${COMPANY.telephone}`}>
          {COMPANY.telephone}
        </a>
      </p>
    </address>
  );
}
