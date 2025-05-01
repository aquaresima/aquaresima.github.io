AUTHOR = 'Alessio'
SITENAME = 'Alessio Quaresima'
SITEURL = ""
SITETITLE= "Alessio Quaresima"
SITESUBTITLE=""


THEME = "Flex"
BROWSER_COLOR = "#222222"
PYGMENTS_STYLE = "lovelace"
FAVICON = SITEURL + '/images/favicon.ico'
SITELOGO = SITEURL + "/images/science_profile_retouched.png"

PATH = "content"

TIMEZONE = 'Europe/Rome'
DEFAULT_LANG = 'en'
ROBOTS = "index, follow"

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
LOAD_CONTENT_CACHE = False

PAGE_ORDER_BY = 'page_order'


# Blogroll
LINKS = (
    # ('blog', '/pages/blog.html'),
    ('debris', 'https://www.inventati.org/debris/'),
    ('Julia Spiking Neural Networks', 'https://github.com/JuliaSNN'),
)
# Social widget
# SOCIAL = (
#     ('gitorious', 'https://gitorious.org/~hook'),
#     ('github', 'https://github.com/silverhook'),
#     ('friendica', 'https://friendica.free-beer.ch/profile/hook'),
# )

MAIN_MENU = False

# MENUITEMS = (
#     ("Archives", "/archives.html"),
#     ("Tags", "/tags.html"),
# )

USE_FOLDER_AS_CATEGORY = False
HOME_HIDE_TAGS = True

# GITHUB_CORNER_URL = "https://github.com/alexandrevicenzi/Flex"

SOCIAL = (
    ("github", "https://github.com/aquaresima"),
    ("linkedin","https://www.linkedin.com/in/alessio-quaresima-8a0024200/"),
    ("twitter", "https://bsky.app/profile/bluedebris.bsky.social"),
)

CC_LICENSE = {
    "name": "Creative Commons Attribution-ShareAlike 4.0 International License",
    "version": "4.0",
    "slug": "by-sa",
    "icon": True,
    "language": "en_US",
}



STATIC_PATHS = ["images", "extra/ads.txt", "extra/CNAME"]

EXTRA_PATH_METADATA = {
    "extra/ads.txt": {"path": "ads.txt"},
    "extra/CNAME": {"path": "CNAME"},
}

# Social widget

SITEURL = ''

#! https://stackoverflow.com/questions/55363180/how-do-i-choose-a-category-page-to-be-the-home-page-for-a-pelican-site
ARTICLE_EXCLUDES = ['templates', 'articles']
TEMPLATE_PAGES = {
    # 'templates/homepage.html': 'pages/blog.html',
    # 'templates/homepage.html': 'index.html',
} 

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

THEME_COLOR_AUTO_DETECT_BROWSER_PREFERENCE = True
THEME_COLOR_ENABLE_USER_OVERRIDE = True

USE_LESS = True