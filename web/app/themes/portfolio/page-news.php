 <?php
global $paged;
global $params;
if (!isset($paged) || !$paged){
    $paged = 1;
}

if(isset($params['paged'])) {
	$paged = $params['paged'];
}

/*Get news custom posts + categories*/

$context = Timber::get_context();

$args = array(
	'post_type' => 'news',
	'posts_per_page' => 5,
	'paged' => $paged
);
query_posts($args);

$context['categories'] = Timber::get_terms('category');
$posts = Timber::get_posts($args);

$context['post'] = new TimberPost();

$context['posts'] = $posts;

$context['pagination'] = Timber::get_pagination();
Timber::render('page-news.twig', $context);