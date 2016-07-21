<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
<title>Maven + Spring MVC</title>
 
<spring:url value="/resources/core/css/hello.css" var="coreCss" />
<spring:url value="/resources/core/css/bootstrap.min.css" var="bootstrapCss" />
<link href="${bootstrapCss}" rel="stylesheet" />
<link href="${coreCss}" rel="stylesheet" />
</head>
 
<nav class="navbar navbar-inverse navbar-fixed-top">
  <div class="container">
	<div class="navbar-header">
	</div>
  </div>
</nav>
 
<div class="jumbotron">
  <div class="container">
	<h1>${title}</h1>
	<p>
		
			Welcome Welcome!
    </p>
    <p>
		<a class="btn btn-primary btn-lg" href="" role="button" >send success</a>
	</p>
	</div>
</div>
 
<div class="container">
 
  <div class="row">
	<div class="col-md-4">
		<h2>Hello</h2>
		<p>ABC</p>
		<p>
			<a class="btn btn-default" href="#" role="button">View details</a>
		</p>
	</div>
	<div class="col-md-4">
	<a class="btn btn-default" href="/gmail-push/gmail" role="button">Watch</a>
	<a class="btn btn-default" href="/gmail-push/gmail" role="button">Fetch new</a>
	   <p>fetched ${number} emails</p>
	   <h1>Newest:</h1>
		<h2>From:</h2>
			<p>${from}</p>
		<h2>Recipient:</h2>
		<p>${recipient}</p>
		<h2>subject</h2>
		 <p>${subject}</p>		 
		 <h2>Content</h2>
		<p>
			${content}
		</p>
		 <h2>Message id</h2>
		 <p>
		      ${messageid}
		 </p>
	</div>
	
	
  </div>
 
 
  <hr>
  <footer>
	<p>&copy; Mkyong.com 2015</p>
  </footer>
</div>
 
<spring:url value="/resources/core/css/hello.js" var="coreJs" />
<spring:url value="/resources/core/css/bootstrap.min.js" var="bootstrapJs" />
 
<script src="${coreJs}"></script>
<script src="${bootstrapJs}"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script> 
</body>
</html>