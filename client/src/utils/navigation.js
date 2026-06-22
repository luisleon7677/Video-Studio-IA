const navByPath = new Map()

export function getActiveNavItem(pathname, navItems) {
  if (navByPath.size !== navItems.length) {
    navByPath.clear()
    for (const item of navItems) {
      navByPath.set(item.path, item)
    }
  }

  if (navByPath.has(pathname)) {
    return navByPath.get(pathname)
  }

  for (const item of navItems) {
    if (item.path !== '/' && pathname.startsWith(item.path)) {
      return item
    }
  }

  return navItems[0]
}
