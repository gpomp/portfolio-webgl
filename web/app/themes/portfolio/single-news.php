<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /functions sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::get_context();
$post = Timber::query_post();
$context['post'] = $post;
$context['wp_title'] .= ' - ' . $post->title();
$context['curr_url'] = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";	

$post_news = new TimberPost(157);
$context['post_news'] = $post_news;

Timber::render(array('single-news' . $post->ID . '.twig', 'single-news' . $post->post_type . '.twig', 'single-news.twig'), $context);


