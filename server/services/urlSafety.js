
const dns = require("node:dns/promises");
const net = require("node:net");
const ipaddr = require("ipaddr.js");

const validatePublicUrl = async (rawUrl) => {
  let parsedUrl;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw new Error("URLs containing credentials are not allowed");
  }

  if (parsedUrl.port && !["80", "443"].includes(parsedUrl.port)) {
    throw new Error("Only standard HTTP and HTTPS ports are allowed");
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new Error("Private network URLs are not allowed");
  }

  let addresses;

  if (net.isIP(hostname)) {
    addresses = [{ address: hostname }];
  } else {
    addresses = await dns.lookup(hostname, {
      all: true,
      verbatim: true,
    });
  }

  if (!addresses.length) {
    throw new Error("Unable to resolve hostname");
  }

  for (const item of addresses) {
    const address = ipaddr.parse(item.address);

    if (address.range() !== "unicast") {
      throw new Error("Private or reserved IP addresses are not allowed");
    }
  }

  return parsedUrl.toString();
};

module.exports = validatePublicUrl;
