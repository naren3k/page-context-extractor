Extract Key words and feed to API Calls on load.

Inject script in Nginx 

```javascript Nginx Config
     sub_filter_once on;
        sub_filter '</head>' '<script src="https://xx.load.js"></script>
                             </head>';
        sub_filter_types text/html;
```
```javascript Ingress Controller
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/configuration-snippet: |
      sub_filter '</head>' '<script src="https://xx.load.js"></script>
                           
                            </script>
                            </head>';
      sub_filter_types text/html;
spec:
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: your-backend-service
            port:
              number: 80
```
