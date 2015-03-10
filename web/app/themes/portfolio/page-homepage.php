 <?php


/*Get news custom posts + categories*/

$context = Timber::get_context();

$args = array(
	'post_type' => 'project'
);
query_posts($args);

$posts = Timber::get_posts($args);

$context['post'] = new TimberPost();

$context['posts'] = $posts;

$context['pagination'] = Timber::get_pagination();
Timber::render('page-homepage.twig', $context);