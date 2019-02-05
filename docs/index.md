- [`GET` endpoints](#get-endpoints)
  - [`/create/requisition/programs.json`](#get-programs)
  - [`/create/requisition/supervised/{id}/facilities.json`](#get-facilities)
  - [`/requisitions/{id}.json`](#get-requisitions)
- [`POST` endpoints](#post-endpoints)
  - [`/j_spring_security_check`](#post-j-spring)
  - [`/orders.json`](#post-orders)
  - [`/requisitions.json`](#post-requisitions)
  - [`/requisitions/{id}/comments.json`](#post-comments)
  - [`/schedules.json`](#post-schedules)
  - [`/schedules/{id}/period.json`](#post-periods)
- [`PUT` endpoints](#put-endpoints)
  - [`/requisitions/{id}/approve.json`](#put-approve)
  - [`/requisitions/{id}/authorise.json`](#put-authorise)
  - [`/requisitions/{id}/update.json`](#put-update)
  - [`/requisitions/{id}/submit.json`](#put-submit)

<div id='get-endpoints'/>

## `GET` endpoints

{% include_relative get.md %}

<div id='post-endpoints'/>

## `POST` endpoints

{% include_relative post.md %}

<div id='put-endpoints'/>

## `PUT` endpoints

{% include_relative put.md %}
