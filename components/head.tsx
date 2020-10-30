import NextHead from "next/head";
import { FC } from "react";

type Props = {
  title: string;
  description: string;
};

export const Head: FC<Props> = ({ title, description }) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <title>{title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/static/favicon-16x16.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/static/favicon-32x32.png"
    />
    <link rel="shortcut icon" href="/static/favicon.ico" />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/static/apple-touch-icon.png"
    />
    <link rel="mask-icon" href="/static/favicon-mask.svg" color="#000000" />
    <link
      href="https://fonts.googleapis.com/css2?family=Architects+Daughter&amp;display=swap&amp;text=123456789"
      rel="stylesheet"
    ></link>
  </NextHead>
);
