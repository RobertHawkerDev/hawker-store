import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Image} from '@shopify/hydrogen';
import type {CollectionDetailsFragment} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [storefrontData] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    // Destructure your specific targeted collections
    shirtsCollection: storefrontData.shirtsCollection,
    jacketsCollection: storefrontData.jacketsCollection,
    trousersCollection: storefrontData.trousersCollection,
    beltsCollection: storefrontData.beltsCollection,
    socksCollection: storefrontData.socksCollection,
    shoesCollection: storefrontData.shoesCollection,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  // Group collections into an array for the grid map
  const menuCollections = [
    data.shirtsCollection,
    data.jacketsCollection,
    data.trousersCollection,
    data.beltsCollection,
    data.socksCollection,
    data.shoesCollection,
  ];

  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}

      {/* --- Flowbite Hero Section --- */}
      <section className="bg-white">
        <div className="grid max-w-7xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              Elevated Menswear at Hawker Store
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">
              From tailored jackets to everyday trousers, discover our latest
              collection of premium apparel designed for exceptional fit and
              timeless style.
            </p>
            <Link
              to="/collections/all"
              className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white! rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
            >
              Shop the Collection
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
            >
              Explore Categories
            </a>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img
              src="https://cdn.shopify.com/s/files/1/1056/8646/6897/files/2015-06-04-Matt_Look_40884_23076.jpg?v=1782583637&width=800&height=800&crop=center"
              alt="Hero Mockup"
            />
          </div>
        </div>
      </section>

      {/* --- Section 1 --- */}
      {data.shirtsCollection && (
        <FeaturedCollection collection={data.shirtsCollection} />
      )}

      {/* --- Section 2 --- */}
      {data.jacketsCollection && (
        <FeaturedCollection collection={data.jacketsCollection} />
      )}

      {/* --- Section 3 --- */}
      {data.trousersCollection && (
        <FeaturedCollection collection={data.trousersCollection} />
      )}

      {/* --- Middle Collections Grid Menu --- */}
      <div
        id="categories"
        className="py-16 bg-gray-50 flex flex-col items-center justify-center my-12 border-y border-gray-200"
      >
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-gray-900">
          Explore All Categories
        </h2>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4">
          {menuCollections.map((collection) => {
            if (!collection) return null;
            return (
              <Link
                key={collection.id}
                to={`/collections/${collection.handle}`}
                className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
              >
                {/* Card Image Container */}
                <div className="w-full h-64 overflow-hidden bg-gray-200 relative">
                  {collection.image ? (
                    <Image
                      data={collection.image}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={collection.image.altText || collection.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Card Title */}
                <div className="p-5 text-center border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {collection.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- Section 4 --- */}
      {data.beltsCollection && (
        <FeaturedCollection collection={data.beltsCollection} />
      )}

      {/* --- Section 5 --- */}
      {data.socksCollection && (
        <FeaturedCollection collection={data.socksCollection} />
      )}

      {/* --- Section 6 --- */}
      {data.shoesCollection && (
        <FeaturedCollection collection={data.shoesCollection} />
      )}
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: CollectionDetailsFragment;
}) {
  if (!collection) return null;

  return (
    <div className="featured-collection-section">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{collection.title}</h1>
        <Link
          to={`/collections/${collection.handle}`}
          className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
        >
          View More
        </Link>
      </div>

      {/* Render the actual products belonging to this collection */}
      <div className="recommended-products-grid">
        {collection.products?.nodes.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment CollectionDetails on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 4) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
  
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    # Query specific collections by their handles
    beltsCollection: collection(handle: "belts") {
      ...CollectionDetails
    }
    socksCollection: collection(handle: "socks") {
      ...CollectionDetails
    }
    shoesCollection: collection(handle: "shoes") {
      ...CollectionDetails
    }
    trousersCollection: collection(handle: "trousers") {
      ...CollectionDetails
    }
    shirtsCollection: collection(handle: "shirts") {
      ...CollectionDetails
    }
    jacketsCollection: collection(handle: "jackets") {
      ...CollectionDetails
    }
  }
` as const;
